// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { DeviceService, Device } from '../../lib/api/devices';

// interface UserInfo {
//   userId: number;
//   houseId: number;
//   role: string;
// }

// export default function DeviceDetailsPage() {
//   const [deviceId, setDeviceId] = useState<string>('');
//   const [device, setDevice] = useState<Device | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isClient, setIsClient] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     setIsClient(true);
//     const jwtToken = localStorage.getItem('jwt');
//     const storedUserInfo = localStorage.getItem('user');

//     if (!jwtToken || !storedUserInfo) {
//       router.push('/login');
//       return;
//     }
//   }, [router]);

//   const fetchDeviceDetails = async () => {
//     if (!deviceId) {
//       setError('Please enter a device ID');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const jwtToken = localStorage.getItem('jwt');
//       if (!jwtToken) {
//         throw new Error('Session expired. Please login again.');
//       }

//       const deviceData = await DeviceService.getDeviceDetails(parseInt(deviceId), jwtToken);
//       setDevice(deviceData);
//     } catch (err: any) {
//       console.error('Fetch device error:', err);
//       setError(err.message || 'Failed to fetch device details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isClient) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex flex-col">
//         <main className="flex-grow container mx-auto px-6 py-8">
//           <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
//             <p className="text-center">Loading...</p>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   const jwtToken = localStorage.getItem('jwt');
//   const storedUserInfo = localStorage.getItem('user');
//   let userInfo: UserInfo | null = null;

//   try {
//     userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
//   } catch (err) {
//     console.error('Error parsing user info:', err);
//   }

//   if (!jwtToken || !userInfo) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex flex-col">
//         <main className="flex-grow container mx-auto px-6 py-8">
//           <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
//             <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
//               <p className="text-red-700">Please login to access this page</p>
//             </div>
//             <button 
//               onClick={() => router.push('/login')}
//               className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
//             >
//               Go to Login
//             </button>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
//         <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md w-full">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
//             <h1 className="text-2xl sm:text-3xl font-bold text-teal-800">Device Details</h1>
//             <button 
//               onClick={() => router.push('/device-dashboard')}
//               className="px-4 py-2 text-teal-600 hover:text-teal-800 whitespace-nowrap"
//             >
//               ← Back to Dashboard
//             </button>
//           </div>

//           {error && (
//             <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
//               <p className="text-red-700">{error}</p>
//             </div>
//           )}

//           <div className="space-y-6">
//             <div>
//               <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-1">
//                 Enter Device ID*
//               </label>
//               <div className="flex flex-col sm:flex-row gap-2 w-full">
//                 <input
//                   type="text"
//                   id="deviceId"
//                   name="deviceId"
//                   value={deviceId}
//                   onChange={(e) => setDeviceId(e.target.value)}
//                   className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-black w-full"
//                   required
//                   placeholder="Enter device ID (e.g., 1)"
//                 />
//                 <button
//                   onClick={fetchDeviceDetails}
//                   disabled={loading || !deviceId}
//                   className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:bg-gray-400 whitespace-nowrap w-full sm:w-auto"
//                 >
//                   {loading ? 'Fetching...' : 'Get Details'}
//                 </button>
//               </div>
//             </div>

//             {device && (
//               <div className="border border-gray-200 rounded-lg p-4 overflow-hidden">
//                 <h2 className="text-xl font-semibold mb-4 text-teal-800">
//                   Device Information
//                 </h2>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Device ID:</span>
//                     <span className="font-medium text-black">{device.deviceId}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Name:</span>
//                     <span className="font-medium text-black">{device.deviceName}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Type:</span>
//                     <span className="font-medium capitalize text-black">{device.deviceType.toLowerCase()}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Power Rating:</span>
//                     <span className="font-medium text-black">{device.powerRating}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Location:</span>
//                     <span className="font-medium capitalize text-black">{device.location.toLowerCase()}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">House ID:</span>
//                     <span className="font-medium text-black">{device.houseId}</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceService, Device } from '../../lib/api/devices';

interface UserInfo {
  userId: number;
  houseId: number;
  role: string;
}

export default function DeviceDetailsPage() {
  const [deviceId, setDeviceId] = useState<string>('');
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    const jwtToken = localStorage.getItem('jwt');
    const storedUserInfo = localStorage.getItem('user');

    if (!jwtToken || !storedUserInfo) {
      setIsAuthenticated(false);
      router.push('/signin');
      return;
    }

    try {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error parsing user info:', err);
      setIsAuthenticated(false);
      router.push('/signin');
    }
  }, [router]);

  const fetchDeviceDetails = async () => {
    if (!deviceId) {
      setError('Please enter a device ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const jwtToken = localStorage.getItem('jwt');
      if (!jwtToken) {
        throw new Error('Session expired. Please login again.');
      }

      const deviceData = await DeviceService.getDeviceDetails(parseInt(deviceId), jwtToken);
      setDevice(deviceData);
    } catch (err: any) {
      console.error('Fetch device error:', err);
      setError(err.message || 'Failed to fetch device details');
    } finally {
      setLoading(false);
    }
  };

  if (!isClient || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <p className="text-center">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated || !userInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">Please login to access this page</p>
            </div>
            <button 
              onClick={() => router.push('/signin')}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Go to Sign In
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-teal-800">Device Details</h1>
            <button 
              onClick={() => router.push('/device-dashboard')}
              className="px-4 py-2 text-teal-600 hover:text-teal-800 whitespace-nowrap"
            >
              ← Back to Dashboard
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Device ID*
              </label>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="text"
                  id="deviceId"
                  name="deviceId"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-black w-full"
                  required
                  placeholder="Enter device ID (e.g., 1)"
                />
                <button
                  onClick={fetchDeviceDetails}
                  disabled={loading || !deviceId}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:bg-gray-400 whitespace-nowrap w-full sm:w-auto"
                >
                  {loading ? 'Fetching...' : 'Get Details'}
                </button>
              </div>
            </div>

            {device && (
              <div className="border border-gray-200 rounded-lg p-4 overflow-hidden">
                <h2 className="text-xl font-semibold mb-4 text-teal-800">
                  Device Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Device ID:</span>
                    <span className="font-medium text-black">{device.deviceId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-black">{device.deviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize text-black">{device.deviceType.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Power Rating:</span>
                    <span className="font-medium text-black">{device.powerRating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium capitalize text-black">{device.location.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">House ID:</span>
                    <span className="font-medium text-black">{device.houseId}</span>
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