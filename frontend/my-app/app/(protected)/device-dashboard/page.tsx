'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { DeviceService, Device } from '../../lib/api/devices';

interface DecodedToken {
  role: string;
  userId: number;
  houseId: number;
  exp?: number;
}

// Extend Device type locally for UI state
interface DeviceWithUpdating extends Device {
  isUpdating?: boolean;
}

const getDevicesStorageKey = (houseId: number) => `devicesList_${houseId}`;

const getSavedDevices = (houseId: number): Device[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedDevices = localStorage.getItem(getDevicesStorageKey(houseId));
    return savedDevices ? JSON.parse(savedDevices) : [];
  } catch (err) {
    console.error('Error parsing saved devices:', err);
    return [];
  }
};

const saveDevicesToStorage = (houseId: number, devices: Device[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(getDevicesStorageKey(houseId), JSON.stringify(devices));
  } catch (err) {
    console.error('Error saving devices to localStorage:', err);
  }
};

export default function DeviceDashboard() {
  const [devices, setDevices] = useState<DeviceWithUpdating[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    userId: number;
    role: string;
    houseId: number;
  } | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const jwtToken = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
    if (!jwtToken) {
      router.push('/signin');
      return;
    }
    setToken(jwtToken);
    
    try {
      const decoded: DecodedToken = jwtDecode(jwtToken);
      
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('jwt');
        router.push('/signin');
        return;
      }

      const userInfoData = {
        userId: decoded.userId,
        role: decoded.role,
        houseId: decoded.houseId
      };
      
      setUserInfo(userInfoData);

      const savedDevices = getSavedDevices(decoded.houseId);
      if (savedDevices.length > 0) {
        setDevices(savedDevices.map((device: Device) => ({
          ...device,
          isUpdating: false
        })));
        setInitialDataLoaded(true);
      }
    } catch (err) {
      console.error('Error decoding token:', err);
      localStorage.removeItem('jwt');
      router.push('/signin');
    }
  }, [router]);

  const fetchDevices = useCallback(async () => {
    if (!userInfo?.houseId || !token) return;
    try {
      setLoading(true);
      setError(null);
      const devicesList = await DeviceService.getDevicesByHouse(userInfo.houseId, token);
      setDevices(devicesList.map((device: Device) => ({ ...device, isUpdating: false })));
      setInitialDataLoaded(true);
      saveDevicesToStorage(userInfo.houseId, devicesList);
    } catch (err: any) {
      console.error('Failed to fetch devices:', err);
      setError(err.message || 'Failed to load devices. Please try again.');
      if (devices.length > 0) {
        setInitialDataLoaded(true);
      }
    } finally {
      setLoading(false);
    }
  }, [token, userInfo?.houseId, devices.length]);

  const setupEventSource = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (!token || !userInfo?.houseId) return;
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setConnectionStatus('connecting');
    eventSourceRef.current = DeviceService.createDeviceEventSource(userInfo.houseId, token, {
      onInit: (deviceList: Device[]) => {
        setDevices(deviceList.map((device: Device) => ({ ...device, isUpdating: false })));
        setInitialDataLoaded(true);
        saveDevicesToStorage(userInfo.houseId, deviceList);
        setSuccess('Initial device data received');
        setTimeout(() => setSuccess(null), 3000);
      },
      onUpdate: (updated: Device | Device[]) => {
        if (Array.isArray(updated)) {
          setDevices(prevDevices => {
            const merged = updated.map(newDevice => {
              const existingDevice = prevDevices.find(dev => dev.deviceId === newDevice.deviceId);
              return {
                ...newDevice,
                isUpdating: existingDevice?.isUpdating || false
              } as DeviceWithUpdating;
            });
            saveDevicesToStorage(userInfo.houseId, merged);
            return merged;
          });
        } else if (updated && updated.deviceId) {
          setDevices(prevDevices => {
            let updatedDevices: DeviceWithUpdating[];
            const deviceIndex = prevDevices.findIndex(device => device.deviceId === updated.deviceId);
            if (deviceIndex >= 0) {
              updatedDevices = [...prevDevices];
              updatedDevices[deviceIndex] = {
                ...updatedDevices[deviceIndex],
                ...updated,
                isUpdating: false
              };
            } else {
              updatedDevices = [...prevDevices, { ...updated, isUpdating: false }];
            }
            saveDevicesToStorage(userInfo.houseId, updatedDevices);
            return updatedDevices;
          });
        }
        setSuccess('Device status updated');
        setTimeout(() => setSuccess(null), 3000);
      },
      onOpen: () => setConnectionStatus('connected'),
      onError: (err: Event) => {
        console.error('SSE connection error:', err);
        setConnectionStatus('disconnected');
        if (eventSourceRef.current) eventSourceRef.current.close();
        const reconnectDelay = (reconnectTimeoutRef.current ? 10000 : 5000);
        reconnectTimeoutRef.current = window.setTimeout(() => {
          setupEventSource();
        }, reconnectDelay) as unknown as number;
      }
    });
  }, [token, userInfo?.houseId]);

  const toggleDeviceStatus = async (deviceId: number) => {
    if (!userInfo?.houseId) return;
    try {
      setSuccess(null);
      setError(null);
      if (!token) throw new Error('No authentication token found');
      setDevices(prevDevices => {
        const updatedDevices = prevDevices.map(device =>
          device.deviceId === deviceId 
            ? { 
                ...device, 
                status: device.status === 'ON' ? 'OFF' : 'ON',
                on: device.status !== 'ON',
                isUpdating: true
              } 
            : device
        );
        saveDevicesToStorage(userInfo.houseId, updatedDevices);
        return updatedDevices;
      });
      await DeviceService.toggleDeviceStatus(deviceId, token);
      setTimeout(() => {
        setDevices(prevDevices => {
          const updatedDevices = prevDevices.map(device =>
            device.deviceId === deviceId && device.isUpdating
              ? { ...device, isUpdating: false }
              : device
          );
          saveDevicesToStorage(userInfo.houseId, updatedDevices);
          return updatedDevices;
        });
      }, 5000);
      setSuccess(`Device status toggled successfully`);
    } catch (err: any) {
      console.error('Toggle error:', err);
      setError(err.message || 'Failed to toggle device');
      setDevices(prevDevices => {
        const updatedDevices = prevDevices.map(device =>
          device.deviceId === deviceId
            ? { 
                ...device, 
                status: device.status === 'ON' ? 'OFF' : 'ON',
                on: device.status === 'ON',
                isUpdating: false 
              } 
            : device
        );
        saveDevicesToStorage(userInfo.houseId, updatedDevices);
        return updatedDevices;
      });
    }
  };

  const handleAddDeviceClick = () => router.push('/add-device');
  const handleRemoveDeviceClick = () => router.push('/remove-device');
  const handleDetailDeviceClick = () => router.push('/device-detail');
  const handleUpdateDeviceClick = () => router.push('/update-device');

  const handleRefreshDevices = () => {
    fetchDevices();
    if (connectionStatus === 'disconnected') {
      setupEventSource();
    }
  };

  useEffect(() => {
    let mounted = true;
    
    if (token && userInfo?.houseId && mounted) {
      if (devices.length === 0) {
        fetchDevices();
      }
      setupEventSource();
    }

    return () => {
      mounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [token, userInfo?.houseId, fetchDevices, setupEventSource, devices.length]);

  useEffect(() => {
    const handleOnline = () => {
      if (connectionStatus !== 'connected' && token && userInfo?.houseId) {
        setupEventSource();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [connectionStatus, token, userInfo?.houseId, setupEventSource]);

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

  const isInitialLoading = loading && !initialDataLoaded && devices.length === 0;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-teal-700">
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

          <div className="flex items-center mb-4">
            
            <span className={`text-sm ${
              connectionStatus === 'connected' ? 'text-green-500' : 
              connectionStatus === 'connecting' ? 'text-orange-500' : 
              'text-red-500'
            } flex items-center`}>
              {connectionStatus === 'connected' && (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Connected to updates
                </>
              )}
              {connectionStatus === 'connecting' && (
                <>
                  <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              )}
              {connectionStatus === 'disconnected' && (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Disconnected from updates
                </>
              )}
            </span>
          </div>

          {isInitialLoading && (
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-700">Loading device information...</p>
            </div>
          )}

        

          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            {devices.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No devices found. Add a device to get started.</p>
              </div>
            ) : (
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">Device ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">Power Usage (W)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {devices.map(device => (
                    <tr key={device.deviceId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 border-b">{device.deviceId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-b">{device.deviceName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-b">{device.deviceType}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-b">{device.powerUsage || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-b">{device.location || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-b">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          device.status === 'ON' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {device.status}
                        </span>
                        {device.isUpdating && (
                          <span className="ml-2 inline-block">
                            <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-b">
                        <button
                          onClick={() => toggleDeviceStatus(device.deviceId)}
                          className={`px-3 py-1 rounded text-white text-sm ${
                            device.status === 'ON' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                          } ${device.isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={device.isUpdating}
                        >
                          {device.status === 'ON' ? 'Turn OFF' : 'Turn ON'}
                          {device.isUpdating && (
                            <span className="ml-2 inline-block">
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </span>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}