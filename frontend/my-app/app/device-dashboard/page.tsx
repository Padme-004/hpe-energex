// 'use client';
// import React, { useEffect, useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { jwtDecode } from 'jwt-decode';

// interface Device {
//   deviceId: number;
//   deviceName: string;
//   deviceType: string;
//   status: string;
//   powerUsage: number;
//   houseId: number;
//   isUpdating?: boolean;
// }

// interface DecodedToken {
//   role: string;
//   userId: number;
//   houseId: number;
//   exp?: number;
// }

// export default function DeviceDashboard() {
//   const [devices, setDevices] = useState<Device[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [eventSource, setEventSource] = useState<EventSource | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [userInfo, setUserInfo] = useState<{
//     userId: number;
//     role: string;
//     houseId: number;
//   } | null>(null);

//   const router = useRouter();

//   // Initialize token and user info from localStorage
//   useEffect(() => {
//     const jwtToken = localStorage.getItem('jwt');
//     if (!jwtToken) {
//       router.push('/signin');
//       return;
//     }
//     setToken(jwtToken);
    
//     try {
//       const decoded: DecodedToken = jwtDecode(jwtToken);
      
//       // Check if token is expired
//       if (decoded.exp && decoded.exp * 1000 < Date.now()) {
//         localStorage.removeItem('jwt');
//         router.push('/signin');
//         return;
//       }

//       setUserInfo({
//         userId: decoded.userId,
//         role: decoded.role,
//         houseId: decoded.houseId
//       });
//     } catch (err) {
//       console.error('Error decoding token:', err);
//       localStorage.removeItem('jwt');
//       router.push('/signin');
//     }
//   }, [router]);

//   // Fetch devices
//   const fetchDevices = useCallback(async () => {
//     if (!userInfo?.houseId || !token) return;

//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await fetch(
//         `https://energy-optimisation-backend.onrender.com/api/devices?houseId=${userInfo.houseId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       if (response.status === 401) {
//         localStorage.removeItem('jwt');
//         router.push('/signin');
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(`Failed to fetch devices: ${response.status}`);
//       }

//       const data = await response.json();
//       setDevices((data.content || data).map((device: Device) => ({
//         ...device,
//         isUpdating: false
//       })));
//     } catch (err) {
//       console.error('Failed to fetch devices:', err);
//       setError('Failed to load devices. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }, [token, userInfo?.houseId, router]);

//   // Set up SSE with corrected endpoint
//   const setupEventSource = useCallback(() => {
//     if (!token || !userInfo?.houseId) return;

//     // Close existing connection if any
//     if (eventSource) {
//       eventSource.close();
//     }

//     // Use the correct endpoint with houseId from token and token as parameter
//     const url = `https://energy-optimisation-backend.onrender.com/api/device-status/house/${userInfo.houseId}/subscribe?token=${encodeURIComponent(token)}`;
//     const newEventSource = new EventSource(url);

//     newEventSource.onmessage = (event) => {
//       try {
//         const updatedDevice = JSON.parse(event.data);
//         setDevices(prevDevices =>
//           prevDevices.map(device =>
//             device.deviceId === updatedDevice.deviceId 
//               ? { ...updatedDevice, isUpdating: false }
//               : device
//           )
//         );
//       } catch (err) {
//         console.error('Error parsing SSE data:', err);
//       }
//     };

//     newEventSource.onerror = (err) => {
//       console.error('SSE connection error:', err);
//       newEventSource.close();
//       // Attempt to reconnect after a delay
//       setTimeout(setupEventSource, 5000);
//     };

//     setEventSource(newEventSource);

//     return () => {
//       newEventSource.close();
//     };
//   }, [token, userInfo?.houseId]);

//   // Toggle device status with optimistic UI update
//   // Modify the toggleDeviceStatus function to include a timeout
// const toggleDeviceStatus = async (deviceId: number) => {
//   try {
//     setSuccess(null);
//     setError(null);
    
//     if (!token) {
//       throw new Error('No authentication token found');
//     }

//     // Optimistically update the UI first
//     setDevices(prevDevices =>
//       prevDevices.map(device =>
//         device.deviceId === deviceId 
//           ? { 
//               ...device, 
//               status: device.status === 'ON' ? 'OFF' : 'ON',
//               isUpdating: true
//             } 
//           : device
//       )
//     );

//     const response = await fetch(
//       `https://energy-optimisation-backend.onrender.com/api/device-status/${deviceId}/toggle`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       }
//     );

//     if (response.status === 401) {
//       localStorage.removeItem('jwt');
//       router.push('/signin');
//       return;
//     }

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to toggle device status');
//     }

//     // Add a timeout to reset the updating state if SSE doesn't respond within 5 seconds
//     setTimeout(() => {
//       setDevices(prevDevices =>
//         prevDevices.map(device =>
//           device.deviceId === deviceId && device.isUpdating
//             ? { ...device, isUpdating: false }
//             : device
//         )
//       );
//     }, 5000);

//     setSuccess(`Device status toggled successfully`);
//   } catch (err) {
//     console.error('Toggle error:', err);
//     setError(err instanceof Error ? err.message : 'Failed to toggle device');
//     // Reset the updating state and revert optimistic update on error
//     setDevices(prevDevices =>
//       prevDevices.map(device =>
//         device.deviceId === deviceId
//           ? { ...device, isUpdating: false } 
//           : device
//       )
//     );
//     fetchDevices();
//   }
// };
//   // Navigation handlers
//   const handleAddDeviceClick = () => router.push('/add-device');
//   const handleRemoveDeviceClick = () => router.push('/remove-device');
//   const handleDetailDeviceClick = () => router.push('/device-detail');
//   const handleUpdateDeviceClick = () => router.push('/update-device');

//   // Main effect to initialize data and SSE
//   useEffect(() => {
//     if (token && userInfo?.houseId) {
//       fetchDevices();
//       const cleanup = setupEventSource();
      
//       return () => {
//         if (cleanup) cleanup();
//       };
//     }
//   }, [token, userInfo?.houseId, fetchDevices, setupEventSource]);

//   if (!token || !userInfo) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex flex-col">
//         <main className="flex-grow container mx-auto px-6 py-8">
//           <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
//             <div className="text-center py-8">
//               <p className="text-gray-700">Loading...</p>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex flex-col">
//         <main className="flex-grow container mx-auto px-6 py-8">
//           <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
//             <div className="text-center py-8">
//               <p className="text-gray-700">Loading devices...</p>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <main className="flex-grow container mx-auto px-6 py-8">
//         <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold text-teal-700">
//               Device Dashboard {userInfo.houseId && `(House ${userInfo.houseId})`}
//             </h1>
//             <div className="flex space-x-2">
//               <button 
//                 onClick={handleAddDeviceClick} 
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
//               >
//                 + Add Device
//               </button>
//               <button 
//                 onClick={handleDetailDeviceClick} 
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
//               >
//                 Device Details
//               </button>
//               <button 
//                 onClick={handleRemoveDeviceClick} 
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
//               >
//                 - Remove Device
//               </button>
//               <button 
//                 onClick={handleUpdateDeviceClick} 
//                 className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-medium"
//               >
//                 Update Device
//               </button>
//             </div>
//           </div>

//           {success && (
//             <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
//               <p className="text-green-700">{success}</p>
//             </div>
//           )}

//           {error && (
//             <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
//               <p className="text-red-700">{error}</p>
//             </div>
//           )}

//           <div className="overflow-x-auto">
//             {devices.length === 0 ? (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No devices found. Add a device to get started.</p>
//               </div>
//             ) : (
//               <table className="min-w-full border border-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">Device ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">Type</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">Power Usage (W)</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {devices.map(device => (
//                     <tr key={device.deviceId} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 text-sm text-gray-900 border-b">{device.deviceId}</td>
//                       <td className="px-6 py-4 text-sm text-gray-900 border-b">{device.deviceName}</td>
//                       <td className="px-6 py-4 text-sm text-gray-900 border-b">{device.deviceType}</td>
//                       <td className="px-6 py-4 text-sm text-gray-900 border-b">{device.powerUsage}</td>
//                       <td className="px-6 py-4 text-sm text-gray-900 border-b">
//                         <span className={`px-2 py-1 rounded-full text-xs ${
//                           device.status === 'ON' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}>
//                           {device.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900 border-b">
//                         <button
//                           onClick={() => toggleDeviceStatus(device.deviceId)}
//                           className={`px-3 py-1 rounded text-white text-sm ${
//                             device.status === 'ON' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
//                           } ${device.isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
//                           disabled={device.isUpdating}
//                         >
//                           {device.status === 'ON' ? 'Turn OFF' : 'Turn ON'}
//                           {device.isUpdating && (
//                             <span className="ml-2 inline-block">
//                               <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                               </svg>
//                             </span>
//                           )}
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface Device {
  deviceId: number;
  deviceName: string;
  deviceType: string;
  status?: string;  // Renamed from the SSE data
  powerUsage?: number;  // Renamed from the SSE data
  powerRating?: string; // From SSE data
  location?: string;    // From SSE data
  on?: boolean;         // From SSE data
  turnedOnAt?: string;  // From SSE data
  houseId?: number;
  isUpdating?: boolean;
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
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Use ref for the EventSource to prevent re-renders
  const eventSourceRef = useRef<EventSource | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    userId: number;
    role: string;
    houseId: number;
  } | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  const router = useRouter();

  // Initialize token and user info from localStorage
  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt');
    if (!jwtToken) {
      router.push('/signin');
      return;
    }
    setToken(jwtToken);
    
    try {
      const decoded: DecodedToken = jwtDecode(jwtToken);
      
      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('jwt');
        router.push('/signin');
        return;
      }

      setUserInfo({
        userId: decoded.userId,
        role: decoded.role,
        houseId: decoded.houseId
      });

      // Try to load saved devices while waiting for API
      const savedDevices = localStorage.getItem(`devicesList_${decoded.houseId}`);
      if (savedDevices) {
        try {
          const parsedDevices = JSON.parse(savedDevices);
          setDevices(parsedDevices.map((device: Device) => ({
            ...device,
            isUpdating: false
          })));
        } catch (err) {
          console.error('Error parsing saved devices:', err);
        }
      }
    } catch (err) {
      console.error('Error decoding token:', err);
      localStorage.removeItem('jwt');
      router.push('/signin');
    }
  }, [router]);

  // Fetch devices - this function won't change on every render
  const fetchDevices = useCallback(async () => {
    if (!userInfo?.houseId || !token) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://energy-optimisation-backend.onrender.com/api/devices?houseId=${userInfo.houseId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('jwt');
        router.push('/signin');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch devices: ${response.status}`);
      }

      const data = await response.json();
      const devicesList = (data.content || data).map((device: Device) => ({
        ...device,
        status: device.on ? 'ON' : 'OFF', // Map 'on' to 'status'
        powerUsage: parseInt(device.powerRating?.replace('W', '') || '0', 10), // Extract wattage
        isUpdating: false
      }));
      
      setDevices(devicesList);
      
      // Save devices to localStorage with house ID as part of the key
      localStorage.setItem(`devicesList_${userInfo.houseId}`, JSON.stringify(devicesList));
    } catch (err) {
      console.error('Failed to fetch devices:', err);
      setError('Failed to load devices. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token, userInfo?.houseId, router]);

  // Convert SSE device format to our component device format
  const normalizeDeviceData = (sseDevice: any): Device => {
    return {
      ...sseDevice,
      status: sseDevice.on ? 'ON' : 'OFF',
      powerUsage: parseInt(sseDevice.powerRating?.replace('W', '') || '0', 10),
      isUpdating: false
    };
  };

  // Setup SSE connection with proper event type handling
  const setupEventSource = useCallback(() => {
    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Check if we have the required data and no existing connection
    if (!token || !userInfo?.houseId) return;
    
    // Close existing connection if any
    if (eventSourceRef.current) {
      console.log('Closing existing SSE connection');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setConnectionStatus('connecting');
    
    // Create the URL with token and houseId
    const url = `https://energy-optimisation-backend.onrender.com/api/device-status/house/${userInfo.houseId}/subscribe?token=${encodeURIComponent(token)}`;
    
    console.log('Setting up new SSE connection');
    const newEventSource = new EventSource(url);

    // Set up event-specific handlers
    newEventSource.addEventListener('INIT', (event) => {
      try {
        console.log('SSE INIT event received:', event.data);
        const deviceList = JSON.parse(event.data);
        
        if (Array.isArray(deviceList)) {
          const normalizedDevices = deviceList.map(normalizeDeviceData);
          
          setDevices(normalizedDevices);
          
          // Save updated devices to localStorage
          if (userInfo?.houseId) {
            localStorage.setItem(`devicesList_${userInfo.houseId}`, JSON.stringify(normalizedDevices));
          }
          
          setSuccess('Initial device data received');
          setTimeout(() => setSuccess(null), 3000);
        }
      } catch (err) {
        console.error('Error parsing INIT event data:', err, event.data);
      }
    });

    newEventSource.addEventListener('DEVICE_UPDATE', (event) => {
      try {
        console.log('SSE DEVICE_UPDATE event received:', event.data);
        const deviceList = JSON.parse(event.data);
        
        if (Array.isArray(deviceList)) {
          const normalizedDevices = deviceList.map(normalizeDeviceData);
          
          setDevices(normalizedDevices);
          
          // Save updated devices to localStorage
          if (userInfo?.houseId) {
            localStorage.setItem(`devicesList_${userInfo.houseId}`, JSON.stringify(normalizedDevices));
          }
          
          setSuccess('Device status updated');
          setTimeout(() => setSuccess(null), 3000);
        }
      } catch (err) {
        console.error('Error parsing DEVICE_UPDATE event data:', err, event.data);
      }
    });

    // Set up generic message handler as fallback
    newEventSource.onmessage = (event) => {
      try {
        console.log('SSE generic message received:', event.data);
        // This is a fallback in case we receive a message without a specific event type
        const data = JSON.parse(event.data);
        
        if (Array.isArray(data)) {
          // Handle array of devices
          const normalizedDevices = data.map(normalizeDeviceData);
          setDevices(normalizedDevices);
          
          // Save updated devices to localStorage
          if (userInfo?.houseId) {
            localStorage.setItem(`devicesList_${userInfo.houseId}`, JSON.stringify(normalizedDevices));
          }
        } else if (data && data.deviceId) {
          // Handle single device update
          setDevices(prevDevices => {
            const deviceExists = prevDevices.some(device => device.deviceId === data.deviceId);
            const normalizedDevice = normalizeDeviceData(data);
            
            let updatedDevices;
            if (deviceExists) {
              // Update existing device
              updatedDevices = prevDevices.map(device =>
                device.deviceId === data.deviceId 
                  ? { ...device, ...normalizedDevice }
                  : device
              );
            } else {
              // Add new device if it doesn't exist
              updatedDevices = [...prevDevices, normalizedDevice];
            }
            
            // Save updated devices to localStorage
            if (userInfo?.houseId) {
              localStorage.setItem(`devicesList_${userInfo.houseId}`, JSON.stringify(updatedDevices));
            }
            
            return updatedDevices;
          });
        }
        
        setSuccess('Device data updated');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('Error parsing generic SSE data:', err, event.data);
      }
    };

    // Set up open handler
    newEventSource.onopen = () => {
      console.log('SSE connection opened');
      setConnectionStatus('connected');
    };

    // Set up error handler with better reconnection logic
    newEventSource.onerror = (err) => {
      console.error('SSE connection error:', err);
      setConnectionStatus('disconnected');
      
      // Close the connection
      newEventSource.close();
      
      // Only attempt reconnect if not unmounted
      reconnectTimeoutRef.current = window.setTimeout(() => {
        console.log('Attempting to reconnect SSE');
        setupEventSource();
      }, 5000) as unknown as number;
    };

    // Store the event source in the ref
    eventSourceRef.current = newEventSource;
  }, [token, userInfo?.houseId]);

  // Toggle device status
  const toggleDeviceStatus = async (deviceId: number) => {
    try {
      setSuccess(null);
      setError(null);
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Optimistically update the UI first
      setDevices(prevDevices => {
        const updatedDevices = prevDevices.map(device =>
          device.deviceId === deviceId 
            ? { 
                ...device, 
                status: device.status === 'ON' ? 'OFF' : 'ON',
                isUpdating: true
              } 
            : device
        );
        
        // Save updated devices to localStorage
        if (userInfo?.houseId) {
          localStorage.setItem(`devicesList_${userInfo.houseId}`, JSON.stringify(updatedDevices));
        }
        
        return updatedDevices;
      });

      const response = await fetch(
        `https://energy-optimisation-backend.onrender.com/api/device-status/${deviceId}/toggle`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('jwt');
        router.push('/signin');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle device status');
      }

      // Add a timeout to reset the updating state if SSE doesn't respond within 5 seconds
      setTimeout(() => {
        setDevices(prevDevices => {
          const updatedDevices = prevDevices.map(device =>
            device.deviceId === deviceId && device.isUpdating
              ? { ...device, isUpdating: false }
              : device
          );
          
          // Save updated devices to localStorage
          if (userInfo?.houseId) {
            localStorage.setItem(`devicesList_${userInfo.houseId}`, JSON.stringify(updatedDevices));
          }
          
          return updatedDevices;
        });
      }, 5000);

      setSuccess(`Device status toggled successfully`);
    } catch (err) {
      console.error('Toggle error:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle device');
      // Reset the updating state and revert optimistic update on error
      setDevices(prevDevices => {
        const updatedDevices = prevDevices.map(device =>
          device.deviceId === deviceId
            ? { 
                ...device, 
                status: device.status === 'ON' ? 'OFF' : 'ON', // Revert the status
                isUpdating: false 
              } 
            : device
        );
        
        // Save updated devices to localStorage
        if (userInfo?.houseId) {
          localStorage.setItem(`devicesList_${userInfo.houseId}`, JSON.stringify(updatedDevices));
        }
        
        return updatedDevices;
      });
    }
  };

  // Navigation handlers
  const handleAddDeviceClick = () => router.push('/add-device');
  const handleRemoveDeviceClick = () => router.push('/remove-device');
  const handleDetailDeviceClick = () => router.push('/device-detail');
  const handleUpdateDeviceClick = () => router.push('/update-device');

  // Force refresh devices button
  const handleRefreshDevices = () => {
    fetchDevices();
  };

  // Main effect to initialize data and SSE - RUNS ONCE ON MOUNT
  useEffect(() => {
    let mounted = true;
    
    // Initial data fetch when userInfo is available
    if (token && userInfo?.houseId && mounted) {
      console.log('Initial fetch and SSE setup');
      fetchDevices();
      setupEventSource();
    }

    // Cleanup function
    return () => {
      mounted = false;
      
      // Clear any reconnect timeouts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Close SSE connection
      if (eventSourceRef.current) {
        console.log('Closing SSE connection on unmount');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [token, userInfo?.houseId, fetchDevices, setupEventSource]); // Added function dependencies

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
            <button
              onClick={handleRefreshDevices}
              className="mr-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Devices
            </button>
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

          {loading && (
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


