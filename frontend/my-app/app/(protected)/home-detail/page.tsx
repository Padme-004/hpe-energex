'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { House, HouseService } from '../../lib/api/houses';

export default function HomeDetailsPage() {
  const [homeId, setHomeId] = useState<string>('');
  const [home, setHome] = useState<House | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{ userId: number; role: string } | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt');
    const storedUserInfo = localStorage.getItem('user');

    if (jwtToken) setToken(jwtToken);

    if (storedUserInfo) {
      try {
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (err) {
        console.error('Error parsing user info:', err);
      }
    }

    setIsAuthChecked(true);
  }, []);

  useEffect(() => {
    if (isAuthChecked && (!token || !userInfo)) {
      router.push('/login');
    }
  }, [isAuthChecked, token, userInfo, router]);

  const fetchHomeDetails = async () => {
    if (!homeId) {
      setError('Please enter a home ID');
      return;
    }

    setLoading(true);
    setError(null);
    setHome(null);

    try {
      const jwtToken = localStorage.getItem('jwt');
      if (!jwtToken) {
        throw new Error('Session expired. Please login again.');
      }

      const homeData = await HouseService.getHouseDetails(homeId, jwtToken);
      setHome(homeData);
    } catch (err: any) {
      console.error('Fetch home error:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to fetch home details');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-teal-700">Home Details</h1>
            <button
              onClick={() => router.push('/home-dashboard')}
              className="px-4 py-2 text-teal-600 hover:text-teal-800"
            >
              ← Back
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 break-words">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="homeId" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Home ID*
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  id="homeId"
                  name="homeId"
                  value={homeId}
                  onChange={(e) => setHomeId(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-black"
                  required
                  placeholder="e.g., 1"
                />
                <button
                  onClick={fetchHomeDetails}
                  disabled={loading || !homeId}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:bg-gray-400"
                >
                  {loading ? 'Fetching...' : 'Get Details'}
                </button>
              </div>
            </div>

            {home && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-teal-700">Home Information</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Home ID:</span>
                    <span className="font-medium text-black">{home.houseId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-black">{home.houseName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-black">{home.location}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
