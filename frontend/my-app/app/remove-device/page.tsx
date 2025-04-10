'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteDevicePage() {
  const [deviceId, setDeviceId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    userId: number;
    houseId: number;
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
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (err) {
        console.error('Error parsing user info:', err);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleDelete = async () => {
    if (!deviceId) {
      setError('Please enter a device ID');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const jwtToken = localStorage.getItem('jwt');
      const currentUserInfo = localStorage.getItem('user');

      if (!jwtToken || !currentUserInfo) {
        throw new Error('Session expired. Please login again.');
      }

      const parsedUserInfo = JSON.parse(currentUserInfo);
      if (parsedUserInfo.role !== 'ROLE_HOUSE_OWNER') {
        throw new Error('Only house owners can delete devices');
      }

      const response = await fetch(
        `https://energy-optimisation-backend.onrender.com/api/devices/${deviceId}`,
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
        throw new Error(errorData.message || 'Failed to delete device');
      }

      setSuccess(`Device ${deviceId} deleted successfully!`);
      setDeviceId('');
      setTimeout(() => router.push('/device-dashboard'), 2500);
    } catch (err: any) {
      console.error('Delete device error:', err);
      setError(err.message || 'Failed to delete device');
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

  if (userInfo.role !== 'ROLE_HOUSE_OWNER') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">Only house owners can delete devices</p>
            </div>
            <button 
              onClick={() => router.push('/device-dashboard')}
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
            <h1 className="text-3xl font-bold" style={{ color: '#008080' }}>Delete Device</h1>
            <button 
              onClick={() => router.push('/device-dashboard')}
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
              <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-1">
                Device ID to Delete*
              </label>
              <input
                type="text"
                id="deviceId"
                name="deviceId"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                required
                placeholder="Enter device ID (e.g., 15)"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleDelete}
                disabled={loading || !deviceId}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                {loading ? 'Deleting...' : 'Delete Device'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}