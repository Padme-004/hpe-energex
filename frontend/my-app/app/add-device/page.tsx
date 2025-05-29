'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddDevicePage() {
  const [device, setDevice] = useState({
    deviceName: '',
    deviceType: 'Appliance',
    powerRating: '', // renamed from powerString
    location: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<number | null>(null); // NEW FIELD
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDevice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setDeviceId(null);

    try {
      const jwtToken = localStorage.getItem('jwt');
      const currentUserInfo = localStorage.getItem('user');

      if (!jwtToken || !currentUserInfo) {
        throw new Error('Session expired. Please login again.');
      }

      const parsedUserInfo = JSON.parse(currentUserInfo);
      if (parsedUserInfo.role !== 'ROLE_HOUSE_OWNER') {
        throw new Error('Only house owners can add devices');
      }

      const payload = {
        deviceName: device.deviceName,
        deviceType: device.deviceType,
        powerRating: device.powerRating, // ensure key matches API
        location: device.location,
        userId: parsedUserInfo.userId,
        houseId: parsedUserInfo.houseId,
      };

      const response = await fetch('https://energy-optimisation-backend.onrender.com/api/devices', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add device');
      }

      setSuccess('Device created successfully!');
      setDeviceId(result.deviceId); // store deviceId from API response
      setTimeout(() => router.push('/device-dashboard'), 2500);
    } catch (err: any) {
      console.error('Add device error:', err);
      setError(err.message || 'Failed to add device');
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
              <p className="text-red-700">Only house owners can add devices</p>
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
            <h1 className="text-3xl font-bold" style={{ color: '#008080' }}>Add New Device</h1>
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
              {deviceId && (
                <p className="text-sm text-green-800 mt-1">
                  Device ID: <span className="font-semibold">{deviceId}</span>
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700 mb-1">
                Device Name*
              </label>
              <input
                type="text"
                id="deviceName"
                name="deviceName"
                value={device.deviceName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                required
                placeholder="Smart Refrigerator"
              />
            </div>

            <div>
              <label htmlFor="deviceType" className="block text-sm font-medium text-gray-700 mb-1">
                Device Type*
              </label>
              <select
                id="deviceType"
                name="deviceType"
                value={device.deviceType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                required
              >
                <option value="Appliance">Appliance</option>
                <option value="Lighting">Lighting</option>
                <option value="Electronics">Electronics</option>
                <option value="HVAC">HVAC</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="powerRating" className="block text-sm font-medium text-gray-700 mb-1">
                Power Rating*
              </label>
              <input
                type="text"
                id="powerRating"
                name="powerRating"
                value={device.powerRating}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                required
                placeholder="250W"
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
                value={device.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                required
                placeholder="Kitchen"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'Create Device'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}