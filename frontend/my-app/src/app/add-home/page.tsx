'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddHomePage() {
  const [home, setHome] = useState({
    houseName: '',
    location: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [houseId, setHouseId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    userId: number;
    role: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt');
    const storedUserInfo = localStorage.getItem('user');

    if (jwtToken) {
      setToken(jwtToken);
    }
    if (storedUserInfo) {
      try {
        const parsedInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedInfo);
        
        // Immediately check if user is ADMIN
        if (parsedInfo.role !== 'ROLE_ADMIN') {
          setError('Only administrators can add homes');
        }
      } catch (err) {
        console.error('Error parsing user info:', err);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHome(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Double check role before submitting
    const currentUserInfo = localStorage.getItem('user');
    if (!currentUserInfo || JSON.parse(currentUserInfo).role !== 'ROLE_ADMIN') {
      setError('Unauthorized: Only administrators can add homes');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setHouseId(null);

    try {
      const jwtToken = localStorage.getItem('jwt');
      if (!jwtToken) {
        throw new Error('Session expired. Please login again.');
      }

      const payload = {
        houseName: home.houseName,
        location: home.location,
      };

      const response = await fetch('https://energy-optimisation-backend.onrender.com/api/houses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add home');
      }

      setSuccess('Home created successfully!');
      setHouseId(result.houseId);
      setTimeout(() => router.push('/home-dashboard'), 2500);
    } catch (err: any) {
      console.error('Add home error:', err);
      setError(err.message || 'Failed to add home');
    } finally {
      setLoading(false);
    }
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
              <p className="text-red-700">Only administrators can add homes</p>
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
            <h1 className="text-3xl font-bold" style={{ color: '#008080' }}>Add New Home</h1>
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
              {houseId && (
                <p className="text-sm text-green-800 mt-1">
                  Home ID: <span className="font-semibold">{houseId}</span>
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="My Lovely Home"
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

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'Create Home'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}