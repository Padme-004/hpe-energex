'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HouseService } from '../../lib/api/houses';

interface Home {
  houseId: number;
  houseName: string;
  location: string;
}

export default function UpdateHomePage() {
  const [homeId, setHomeId] = useState<string>('');
  const [home, setHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState({
    fetch: false,
    update: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    userId: number;
    role: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt');
    const userData = localStorage.getItem('user');

    if (jwtToken) {
      const cleanToken = jwtToken.replace(/^"|"$/g, '').trim();
      setToken(cleanToken);
    }

    if (userData) {
      try {
        let parsedUser = userData;
        if (userData.startsWith('"') && userData.endsWith('"')) {
          parsedUser = userData.slice(1, -1);
        }
        parsedUser = parsedUser.replace(/\\"/g, '"');
        const userInfo = JSON.parse(parsedUser);
        setUserInfo(userInfo);
      } catch (err) {
        console.error('Error parsing user info:', err);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchHome = async () => {
    if (!homeId) {
      setError('Please enter a home ID');
      return;
    }

    setLoading({ ...loading, fetch: true });
    setError(null);
    setHome(null);

    try {
      const jwtToken = localStorage.getItem('jwt');
      const currentUserInfo = localStorage.getItem('user');
      
      if (!jwtToken || !currentUserInfo) {
        throw new Error('Session expired. Please login again.');
      }

      const cleanToken = jwtToken.replace(/^"|"$/g, '').trim();
      let parsedUser = currentUserInfo;
      if (currentUserInfo.startsWith('"') && currentUserInfo.endsWith('"')) {
        parsedUser = currentUserInfo.slice(1, -1);
      }
      parsedUser = parsedUser.replace(/\\"/g, '"');
      const parsedUserInfo = JSON.parse(parsedUser);

      // Use HouseService to fetch home details
      const homeData = await HouseService.getHouseDetails(homeId, cleanToken);
      setHome(homeData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, fetch: false });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!home || !userInfo) return;

    setLoading({ ...loading, update: true });
    setError(null);
    setSuccess(null);

    try {
      const jwtToken = localStorage.getItem('jwt');
      const currentUserInfo = localStorage.getItem('user');
  
      if (!jwtToken || !currentUserInfo) {
        throw new Error('Session expired. Please login again.');
      }

      // Only ADMIN can update homes
      const parsedUserInfo = JSON.parse(currentUserInfo);
      if (parsedUserInfo.role !== 'ROLE_ADMIN') {
        throw new Error('Only administrators can update homes');
      }

      const cleanToken = jwtToken.replace(/^"|"$/g, '').trim();

      // Prepare update data
      const updateData = {
        houseName: home.houseName,
        location: home.location
      };

      // Use HouseService to update the home
      await HouseService.updateHouse(home.houseId, updateData, cleanToken);

      setSuccess('Home updated successfully!');
      setTimeout(() => router.push('/home-dashboard'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, update: false });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!home) return;
    const { name, value } = e.target;
    setHome({ ...home, [name]: value });
  };

  if (!token || !userInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">Please login to access this page</p>
            </div>
            <button 
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Go to Login
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (userInfo.role !== 'ROLE_ADMIN') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">Only administrators can update homes</p>
            </div>
            <button 
              onClick={() => router.push('/home-dashboard')}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
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
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold" style={{ color: '#008080' }}>Update Home</h1>
            <button 
              onClick={() => router.push('/home-dashboard')}
              className="px-4 py-2 text-teal-600 hover:text-teal-800"
            >
              ← Back to Dashboard
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="homeId" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Home ID to Update*
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="homeId"
                  value={homeId}
                  onChange={(e) => setHomeId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-black"
                  placeholder="Enter home ID (e.g., 3)"
                />
                <button
                  onClick={fetchHome}
                  disabled={loading.fetch || !homeId}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:bg-gray-400"
                >
                  {loading.fetch ? 'Loading...' : 'Find Home'}
                </button>
              </div>
            </div>

            {home && (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home ID
                  </label>
                  <div className="px-3 py-2 bg-gray-100 text-black rounded-md">
                    {home.houseId}
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
                    value={home.houseName}
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
                    value={home.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                    required
                    placeholder="City, Country"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading.update}
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:bg-gray-400"
                  >
                    {loading.update ? 'Updating...' : 'Update Home'}
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