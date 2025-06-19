'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceService } from '../../lib/api/devices';

interface Device {
  deviceId: number;
  deviceName: string;
  deviceType: string;
  powerRating: string;
  location: string;
  houseId: number;
  userId: number;
}

interface UserInfo {
  userId: number;
  houseId: number;
  role: string;
}

interface PageState {
  deviceId: string;
  device: Device | null;
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

export default function UpdateDevicePage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>({
    deviceId: '',
    device: null,
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
        router.replace('/signin');
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

  const fetchDevice = async () => {
    if (!state.deviceId) {
      setState(prev => ({ ...prev, error: 'Please enter a device ID' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      loading: { ...prev.loading, fetch: true },
      error: null,
      device: null
    }));

    try {
      if (!state.token) {
        throw new Error('Session expired. Please login again.');
      }

      const deviceData = await DeviceService.getDeviceDetails(
        parseInt(state.deviceId), 
        state.token
      );

      setState(prev => ({ ...prev, device: deviceData }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message }));
    } finally {
      setState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, fetch: false }
      }));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.device || !state.userInfo) return;

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

      if (state.userInfo.role !== 'ROLE_HOUSE_OWNER') {
        throw new Error('Only house owners can update devices');
      }

      const updateData = {
        deviceName: state.device.deviceName,
        deviceType: state.device.deviceType,
        powerRating: state.device.powerRating,
        location: state.device.location,
        houseId: state.userInfo.houseId
      };

      await DeviceService.updateDevice(
        state.device.deviceId, 
        updateData, 
        state.token
      );

      setState(prev => ({ 
        ...prev, 
        success: 'Device updated successfully!' 
      }));
      setTimeout(() => router.push('/device-dashboard'), 2000);
    } catch (err: any) {
      console.error('Update error:', err);
      setState(prev => ({ ...prev, error: err.message }));
    } finally {
      setState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, update: false }
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!state.device) return;
    const { name, value } = e.target;
    setState(prev => ({ 
      ...prev, 
      device: { ...prev.device!, [name]: value }
    }));
  };

  const handleDeviceIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, deviceId: e.target.value }));
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

  if (state.userInfo.role !== 'ROLE_HOUSE_OWNER') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">Only house owners can update devices</p>
            </div>
            <button 
              onClick={() => router.push('/device-dashboard')}
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
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#008080' }}>Update Device</h1>
            <button 
              onClick={() => router.push('/device-dashboard')}
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
              <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Device ID to Update*
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  id="deviceId"
                  value={state.deviceId}
                  onChange={handleDeviceIdChange}
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-black"
                  placeholder="Enter device ID (e.g., 16)"
                />
                <button
                  onClick={fetchDevice}
                  disabled={state.loading.fetch || !state.deviceId}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 whitespace-nowrap"
                >
                  {state.loading.fetch ? 'Loading...' : 'Find Device'}
                </button>
              </div>
            </div>

            {state.device && (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Device ID
                  </label>
                  <div className="px-3 py-2 bg-gray-100 text-black rounded-md">
                    {state.device.deviceId}
                  </div>
                </div>

                <div>
                  <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700 mb-1">
                    Device Name*
                  </label>
                  <input
                    type="text"
                    id="deviceName"
                    name="deviceName"
                    value={state.device.deviceName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="deviceType" className="block text-sm font-medium text-gray-700 mb-1">
                    Device Type*
                  </label>
                  <select
                    id="deviceType"
                    name="deviceType"
                    value={state.device.deviceType}
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
                    value={state.device.powerRating}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                    required
                    placeholder="200W"
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
                    value={state.device.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                    required
                    placeholder="Kitchen"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={state.loading.update}
                    className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400"
                  >
                    {state.loading.update ? 'Updating...' : 'Update Device'}
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