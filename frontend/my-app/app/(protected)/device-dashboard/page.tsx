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
  const [authChecked, setAuthChecked] = useState(false);
  const [isHouseOwner, setIsHouseOwner] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected'|'disconnected'|'connecting'>('disconnected');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const jwtToken = localStorage.getItem('jwt');
      if (!jwtToken) {
        setShouldRedirect(true);
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(jwtToken);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('jwt');
          setShouldRedirect(true);
          return;
        }

        setIsHouseOwner(decoded.role === 'ROLE_HOUSE_OWNER');
        const savedDevices = getSavedDevices(decoded.houseId);
        if (savedDevices.length > 0) {
          setDevices(savedDevices.map(d => ({ ...d, isUpdating: false })));
        }
        setAuthChecked(true);
      } catch (err) {
        console.error('Error decoding token:', err);
        setShouldRedirect(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (shouldRedirect) {
      router.push('/signin');
    }
  }, [shouldRedirect, router]);

  const fetchDevices = useCallback(async () => {
    const jwtToken = localStorage.getItem('jwt');
    if (!jwtToken) return;
    
    try {
      setLoading(true);
      const decoded: DecodedToken = jwtDecode(jwtToken);
      const devicesList = await DeviceService.getDevicesByHouse(decoded.houseId, jwtToken);
      setDevices(devicesList.map(d => ({ ...d, isUpdating: false })));
      saveDevicesToStorage(decoded.houseId, devicesList);
    } catch (err: any) {
      console.error('Failed to fetch devices:', err);
      setError(err.message || 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  }, []);

  const setupEventSource = useCallback(() => {
    const jwtToken = localStorage.getItem('jwt');
    if (!jwtToken) return;

    try {
      const decoded: DecodedToken = jwtDecode(jwtToken);
      if (eventSourceRef.current) eventSourceRef.current.close();

      setConnectionStatus('connecting');
      eventSourceRef.current = DeviceService.createDeviceEventSource(decoded.houseId, jwtToken, {
        onInit: (deviceList: Device[]) => {
          setDevices(deviceList.map(d => ({ ...d, isUpdating: false })));
          saveDevicesToStorage(decoded.houseId, deviceList);
          setConnectionStatus('connected');
        },
        onUpdate: (updated: Device | Device[]) => {
          setDevices(prev => {
            const newDevices = Array.isArray(updated) 
              ? updated.map(d => ({ ...d, isUpdating: false }))
              : prev.map(d => d.deviceId === updated.deviceId ? { ...updated, isUpdating: false } : d);
            saveDevicesToStorage(decoded.houseId, newDevices);
            return newDevices;
          });
          setSuccess('Device updated');
          setTimeout(() => setSuccess(null), 3000);
        },
        onOpen: () => setConnectionStatus('connected'),
        onError: () => {
          setConnectionStatus('disconnected');
          reconnectTimeoutRef.current = setTimeout(setupEventSource, 5000);
        }
      });
    } catch (err) {
      console.error('SSE setup error:', err);
      setConnectionStatus('disconnected');
    }
  }, []);

  const toggleDeviceStatus = async (deviceId: number) => {
    const jwtToken = localStorage.getItem('jwt');
    if (!jwtToken) return;

    setDevices(prev => prev.map(d => 
      d.deviceId === deviceId 
        ? { ...d, status: d.status === 'ON' ? 'OFF' : 'ON', isUpdating: true }
        : d
    ));

    try {
      await DeviceService.toggleDeviceStatus(deviceId, jwtToken);
      setSuccess('Device status updated');
    } catch (err: any) {
      console.error('Toggle failed:', err);
      setError(err.message || 'Failed to toggle device');
      setDevices(prev => prev.map(d => 
        d.deviceId === deviceId 
          ? { ...d, status: d.status === 'ON' ? 'OFF' : 'ON', isUpdating: false }
          : d
      ));
    } finally {
      setTimeout(() => {
        setDevices(prev => prev.map(d => 
          d.deviceId === deviceId ? { ...d, isUpdating: false } : d
        ));
      }, 1000);
    }
  };

  const navigateTo = (path: string) => router.push(path);

  useEffect(() => {
    if (authChecked && !shouldRedirect) {
      fetchDevices();
      setupEventSource();
    }

    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [authChecked, shouldRedirect, fetchDevices, setupEventSource]);

  if (shouldRedirect) {
    return null; 
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <p className="text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 bg-teal-700 text-white">
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:justify-between md:items-center">
            <h1 className="text-xl md:text-2xl font-bold">
              Device Dashboard {isHouseOwner && `(House Admin)`}
            </h1>
            
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button 
                onClick={() => navigateTo('/add-device')}
                className="px-2 py-1.5 sm:px-3 sm:py-2 bg-green-600 hover:bg-green-700 rounded text-xs sm:text-sm whitespace-nowrap"
              >
                + Add
              </button>
              <button 
                onClick={() => navigateTo('/device-detail')}
                className="px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs sm:text-sm whitespace-nowrap"
              >
                Details
              </button>
              {isHouseOwner && (
                <>
                  <button 
                    onClick={() => navigateTo('/remove-device')}
                    className="px-2 py-1.5 sm:px-3 sm:py-2 bg-red-600 hover:bg-red-700 rounded text-xs sm:text-sm whitespace-nowrap"
                  >
                    - Remove
                  </button>
                  <button 
                    onClick={() => navigateTo('/update-device')}
                    className="px-2 py-1.5 sm:px-3 sm:py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-xs sm:text-sm whitespace-nowrap"
                  >
                    Update
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 border-b flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
          <div className="flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'connecting' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}></span>
            <span className="text-xs sm:text-sm text-black">
              {connectionStatus === 'connected' ? 'Live updates connected' :
               connectionStatus === 'connecting' ? 'Connecting...' :
               'Disconnected - retrying...'}
            </span>
          </div>
          <button 
            onClick={fetchDevices}
            className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-xs sm:text-sm self-end xs:self-auto text-black"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="p-3 sm:p-4">
          {loading && devices.length === 0 && (
            <div className="bg-blue-100 border-l-4 border-blue-500 p-3 mb-3">
              <p className="text-blue-700 text-sm">Loading your devices...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-3 mb-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 p-3 mb-3">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}
        </div>

        <div className="block md:hidden">
          {devices.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              {loading ? 'Loading devices...' : 'No devices found'}
            </div>
          ) : (
            devices.map(device => (
              <div key={device.deviceId} className="border-b p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {device.deviceName} <span className="text-xs text-gray-500">(ID: {device.deviceId})</span>
                    </h3>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="mr-2">{device.deviceType}</span>
                      <span className="mr-2">{device.powerUsage || 0}W</span>
                      <span>{device.location || '-'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 rounded-full text-xs mb-2 ${
                      device.status === 'ON' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {device.status}
                    </span>
                    <button
                      onClick={() => toggleDeviceStatus(device.deviceId)}
                      disabled={device.isUpdating}
                      className={`px-3 py-1 rounded text-white text-xs ${
                        device.status === 'ON' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                      } ${device.isUpdating ? 'opacity-50' : ''}`}
                    >
                      {device.isUpdating ? '...' : device.status === 'ON' ? 'OFF' : 'ON'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          {devices.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {loading ? 'Loading devices...' : 'No devices found. Add a device to get started.'}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Power</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devices.map(device => (
                  <tr key={device.deviceId} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {device.deviceId}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {device.deviceName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.deviceType}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.powerUsage || 0}W
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.location || '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        device.status === 'ON' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {device.status}
                        {device.isUpdating && (
                          <span className="ml-1 inline-block">
                            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleDeviceStatus(device.deviceId)}
                        disabled={device.isUpdating}
                        className={`px-3 py-1 rounded text-white text-xs ${
                          device.status === 'ON' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                        } ${device.isUpdating ? 'opacity-50' : ''}`}
                      >
                        {device.status === 'ON' ? 'Turn OFF' : 'Turn ON'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}