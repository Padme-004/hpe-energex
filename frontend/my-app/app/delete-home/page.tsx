'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteHomePage() {
  const [homeId, setHomeId] = useState<string>('');
  const [loading, setLoading] = useState(false);
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
          setError('Only administrators can delete homes');
        }
      } catch (err) {
        console.error('Error parsing user info:', err);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleDelete = async () => {
    if (!homeId) {
      setError('Please enter a home ID');
      return;
    }

    // Double check role before submitting
    const currentUserInfo = localStorage.getItem('user');
    if (!currentUserInfo || JSON.parse(currentUserInfo).role !== 'ROLE_ADMIN') {
      setError('Unauthorized: Only administrators can delete homes');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const jwtToken = localStorage.getItem('jwt');
      if (!jwtToken) {
        throw new Error('Session expired. Please login again.');
      }

      const response = await fetch(
        `https://energy-optimisation-backend.onrender.com/api/houses/${homeId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete home');
      }

      setSuccess(`Home ${homeId} deleted successfully!`);
      setHomeId('');
      setTimeout(() => router.push('/home-dashboard'), 2500);
    } catch (err: any) {
      console.error('Delete home error:', err);
      setError(err.message || 'Failed to delete home');
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
              <p className="text-red-700">Only administrators can delete homes</p>
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
            <h1 className="text-3xl font-bold" style={{ color: '#008080' }}>Delete Home</h1>
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
                Home ID to Delete*
              </label>
              <input
                type="text"
                id="homeId"
                name="homeId"
                value={homeId}
                onChange={(e) => setHomeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                required
                placeholder="Enter home ID (e.g., 2)"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleDelete}
                disabled={loading || !homeId}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                {loading ? 'Deleting...' : 'Delete Home'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}