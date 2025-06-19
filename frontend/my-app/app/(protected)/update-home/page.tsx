'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HouseService } from '../../lib/api/houses';

interface Home {
  houseId: number;
  houseName: string;
  location: string;
}

interface UserInfo {
  userId: number;
  role: string;
}

interface PageState {
  homeId: string;
  home: Home | null;
  loading: {
    fetch: boolean;
    update: boolean;
  };
  error: string | null;
  success: string | null;
  token: string | null;
  userInfo: UserInfo | null;
  initialized: boolean;
}

const getCleanToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const jwtToken = localStorage.getItem('jwt');
  if (!jwtToken) return null;
  return jwtToken.replace(/^"|"$/g, '').trim();
};

const getParsedUserInfo = (): UserInfo | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('user');
  if (!userData) return null;
  
  try {
    let parsedUser = userData;
    if (userData.startsWith('"') && userData.endsWith('"')) {
      parsedUser = userData.slice(1, -1);
    }
    parsedUser = parsedUser.replace(/\\"/g, '"');
    return JSON.parse(parsedUser);
  } catch (err) {
    console.error('Error parsing user info:', err);
    return null;
  }
};

export default function UpdateHomePage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>({
    homeId: '',
    home: null,
    loading: {
      fetch: false,
      update: false
    },
    error: null,
    success: null,
    token: null,
    userInfo: null,
    initialized: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cleanToken = getCleanToken();
      const parsedUserInfo = getParsedUserInfo();

      if (!cleanToken || !parsedUserInfo) {
        router.replace('/login');
        return;
      }

      setState(prev => ({
        ...prev,
        token: cleanToken,
        userInfo: parsedUserInfo,
        initialized: true
      }));
    }
  }, [router]);

  const fetchHome = async () => {
    if (!state.homeId) {
      setState(prev => ({ ...prev, error: 'Please enter a home ID' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      loading: { ...prev.loading, fetch: true },
      error: null,
      home: null
    }));

    try {
      if (!state.token) {
        throw new Error('Session expired. Please login again.');
      }

      const homeData = await HouseService.getHouseDetails(state.homeId, state.token);
      
      if (!homeData) {
        throw new Error('Home ID doesn\'t exist');
      }
      
      setState(prev => ({ ...prev, home: homeData }));
    } catch (err: any) {
      const errorMessage = err.message.includes('404') || err.message.includes('not found') 
        ? 'Home ID doesn\'t exist' 
        : err.message;
      setState(prev => ({ ...prev, error: errorMessage }));
    } finally {
      setState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, fetch: false }
      }));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.home || !state.userInfo) return;

    setState(prev => ({ 
      ...prev, 
      loading: { ...prev.loading, update: true },
      error: null,
      success: null
    }));

    try {
      if (!state.token || !state.userInfo) {
        throw new Error('Session expired. Please login again.');
      }

      if (state.userInfo.role !== 'ROLE_ADMIN') {
        throw new Error('Only administrators can update homes');
      }

      const updateData = {
        houseName: state.home.houseName,
        location: state.home.location
      };

      await HouseService.updateHouse(state.home.houseId, updateData, state.token);

      setState(prev => ({ 
        ...prev, 
        success: 'Home updated successfully!' 
      }));
      setTimeout(() => router.push('/home-dashboard'), 2000);
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message }));
    } finally {
      setState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, update: false }
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!state.home) return;
    const { name, value } = e.target;
    setState(prev => ({ 
      ...prev, 
      home: { ...prev.home!, [name]: value }
    }));
  };

  const handleHomeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, homeId: e.target.value }));
  };

  if (!state.initialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!state.token || !state.userInfo) {
    return null;
  }

  if (state.userInfo.role !== 'ROLE_ADMIN') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded-md">
              <p className="text-red-700">Only administrators can update homes</p>
            </div>
            <button 
              onClick={() => router.push('/home-dashboard')}
              className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#008080' }}>Update Home</h1>
            <button 
              onClick={() => router.push('/home-dashboard')}
              className="w-full sm:w-auto px-4 py-2 text-teal-600 hover:text-teal-800 border border-teal-600 rounded-md"
            >
              ← Back to Dashboard
            </button>
          </div>

          {state.error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded-md">
              <p className="text-red-700">{state.error}</p>
            </div>
          )}

          {state.success && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6 rounded-md">
              <p className="text-green-700">{state.success}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="homeId" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Home ID to Update*
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  id="homeId"
                  value={state.homeId}
                  onChange={handleHomeIdChange}
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-black"
                  placeholder="Enter home ID (e.g., 3)"
                />
                <button
                  onClick={fetchHome}
                  disabled={state.loading.fetch || !state.homeId}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 whitespace-nowrap"
                >
                  {state.loading.fetch ? 'Loading...' : 'Find Home'}
                </button>
              </div>
            </div>

            {state.home && (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home ID
                  </label>
                  <div className="px-3 py-2 bg-gray-100 text-black rounded-md">
                    {state.home.houseId}
                  </div>
                </div>

                <div>
                  <label htmlFor="houseName" className="block text-sm font-medium text-gray-700 mb-1">
                    Home Name*
                  </label>
                  <input
                    type="text"
                    id="houseName"
                    name="houseName"
                    value={state.home.houseName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location*
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={state.home.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                    required
                    placeholder="City, Country"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={state.loading.update}
                    className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400"
                  >
                    {state.loading.update ? 'Updating...' : 'Update Home'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}