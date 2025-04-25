'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface Device {
  deviceId: number;
  deviceName: string;
  deviceType: string;
  status: string;
  powerUsage: number;
  houseId: number;
}

interface DecodedToken {
  role: string;
  userId: number;
  houseId: number;
  exp?: number;
}

export default function DeviceDashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    userId: number;
    role: string;
    houseId: number;
  } | null>(null);
  
  const router = useRouter();

  // Initialize token and user info from localStorage
  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt');
    const storedUserInfo = localStorage.getItem('user');

    if (jwtToken) {
      setToken(jwtToken);
    } else {
      router.push('/login');
    }

    if (storedUserInfo) {
      try {
        const parsedInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedInfo);
      } catch (err) {
        console.error('Error parsing user info:', err);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  // Decode token to get houseId and validate session
  useEffect(() => {
    if (!token) return;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      
      // Check token expiration
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      // Update user info with decoded token data
      setUserInfo(prev => ({
        ...prev,
        userId: decoded.userId,
        role: decoded.role,
        houseId: decoded.houseId
      }));
    } catch (err) {
      console.error('Error decoding token:', err);
      setError('Invalid session. Please log in again.');
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      router.push('/login');
    }
  }, [token, router]);

  // Fetch initial devices data
  const fetchDevices = useCallback(async () => {
    if (!userInfo?.houseId || !token) return;

    try {
      const response = await fetch(
        `https://energy-optimisation-backend.onrender.com/api/devices?houseId=${userInfo.houseId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDevices(data.content || data);
    } catch (err: any) {
      console.error('Failed to fetch devices:', err);
      setError(err.message || 'Failed to load devices.');
    } finally {
      setLoading(false);
    }
  }, [token, userInfo?.houseId, router]);

  // Set up SSE subscription with token as URL parameter
  const setupEventSource = useCallback(() => {
    if (!token || !userInfo?.houseId) return;

    if (eventSource) {
      eventSource.close();
    }

    try {
      const url = new URL(
        `https://energy-optimisation-backend.onrender.com/house/${userInfo.houseId}/subscribe`
      );
      url.searchParams.append('token', token);

      const newEventSource = new EventSource(url.toString());

      newEventSource.onopen = () => {
        console.log('SSE connection established');
        setError(null);
      };

      newEventSource.onmessage = (event) => {
        try {
          const updatedDevice = JSON.parse(event.data);
          setDevices(prevDevices =>
            prevDevices.map(device =>
              device.deviceId === updatedDevice.deviceId ? updatedDevice : device
            )
          );
        } catch (err) {
          console.error('Error parsing SSE data:', err);
        }
      };

      newEventSource.onerror = (err) => {
        console.error('SSE connection error:', err);
        newEventSource.close();
        
        if (err.eventPhase === EventSource.CLOSED) {
          setError('Connection closed. Trying to reconnect...');
          setTimeout(setupEventSource, 5000);
        } else {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('jwt');
          localStorage.removeItem('user');
          router.push('/login');
        }
      };

      setEventSource(newEventSource);

      return () => {
        newEventSource.close();
      };
    } catch (err) {
      console.error('Error setting up SSE:', err);
      setError('Failed to establish real-time connection');
    }
  }, [token, userInfo?.houseId, router]);

  const updateDeviceStatus = async (deviceId: number, newStatus: string) => {
    try {
      setError(null);
      setSuccess(null);
      
      const jwtToken = localStorage.getItem('jwt');
      if (!jwtToken) {
        throw new Error('Session expired. Please login again.');
      }

      const response = await fetch(
        `https://energy-optimisation-backend.onrender.com/api/devices/${deviceId}/status`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update device status');
      }

      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.deviceId === deviceId ? { ...device, status: newStatus } : device
        )
      );
      setSuccess(`Device status updated to ${newStatus}`);
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update device status.');
      fetchDevices();
    }
  };

  // Navigation handlers
  const handleAddDeviceClick = () => router.push('/add-device');
  const handleRemoveDeviceClick = () => router.push('/remove-device');
  const handleDetailDeviceClick = () => router.push('/device-detail');
  const handleUpdateDeviceClick = () => router.push('/update-device');

  useEffect(() => {
    if (token && userInfo?.houseId) {
      fetchDevices();
      setupEventSource();
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [token, userInfo?.houseId, fetchDevices, setupEventSource]);

  if (!token || !userInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="text-center py-8">
              <p className="text-gray-700">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="text-center py-8">
              <p className="text-gray-700">Loading devices...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
            <button 
              onClick={() => {
                setError(null);
                fetchDevices();
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold" style={{ color: '#008080' }}>
              Device Dashboard {userInfo.houseId && `(House ${userInfo.houseId})`}
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={handleAddDeviceClick}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
              >
                + Add Device
              </button>
              <button
                onClick={handleDetailDeviceClick}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
              >
                Device Details
              </button>
              <button
                onClick={handleRemoveDeviceClick}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
              >
                - Remove Device
              </button>
              <button
                onClick={handleUpdateDeviceClick}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-medium"
              >
                Update Device
              </button>
            </div>
          </div>
          
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Device ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Power Usage (W)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devices.map((device) => (
                  <tr key={device.deviceId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{device.deviceId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{device.deviceName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{device.deviceType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{device.powerUsage}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        device.status === 'ON' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {device.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                      <button
                        onClick={() => updateDeviceStatus(device.deviceId, device.status === 'ON' ? 'OFF' : 'ON')}
                        className={`px-3 py-1 rounded text-white text-sm ${
                          device.status === 'ON' 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {device.status === 'ON' ? 'Turn OFF' : 'Turn ON'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}