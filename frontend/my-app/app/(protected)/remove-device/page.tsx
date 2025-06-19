// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { DeviceService } from '../../lib/api/devices';

// export default function DeleteDevicePage() {
//   const [deviceId, setDeviceId] = useState<string>('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [userInfo, setUserInfo] = useState<{
//     userId: number;
//     houseId: number;
//     role: string;
//   } | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const jwtToken = localStorage.getItem('jwt');
//     const storedUserInfo = localStorage.getItem('user');

//     if (jwtToken) {
//       setToken(jwtToken);
//     }
//     if (storedUserInfo) {
//       try {
//         setUserInfo(JSON.parse(storedUserInfo));
//       } catch (err) {
//         console.error('Error parsing user info:', err);
//         router.push('/login');
//       }
//     } else {
//       router.push('/login');
//     }
//   }, [router]);

//   const handleDelete = async () => {
//     if (!deviceId) {
//       setError('Please enter a device ID');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const jwtToken = localStorage.getItem('jwt');
//       const currentUserInfo = localStorage.getItem('user');

//       if (!jwtToken || !currentUserInfo) {
//         throw new Error('Session expired. Please login again.');
//       }

//       const parsedUserInfo = JSON.parse(currentUserInfo);
//       if (parsedUserInfo.role !== 'ROLE_HOUSE_OWNER') {
//         throw new Error('Only house owners can delete devices');
//       }

//       const result = await DeviceService.deleteDevice(parseInt(deviceId), jwtToken);
//       setSuccess(result.message || `Device ${deviceId} deleted successfully!`);
//       setDeviceId('');
//       setTimeout(() => router.push('/device-dashboard'), 2500);
//     } catch (err: any) {
//       console.error('Delete device error:', err);
//       setError(err.message || 'Failed to delete device');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!token || !userInfo) {
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

//   if (userInfo.role !== 'ROLE_HOUSE_OWNER') {
//     return (
//       <div className="min-h-screen bg-gray-100 flex flex-col">
//         <main className="flex-grow container mx-auto px-6 py-8">
//           <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
//             <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
//               <p className="text-red-700">Only house owners can delete devices</p>
//             </div>
//             <button 
//               onClick={() => router.push('/device-dashboard')}
//               className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
//             >
//               Back to Dashboard
//             </button>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <main className="flex-grow container mx-auto px-6 py-8">
//         <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold" style={{ color: '#008080' }}>Delete Device</h1>
//             <button 
//               onClick={() => router.push('/device-dashboard')}
//               className="px-4 py-2 text-teal-600 hover:text-teal-800"
//             >
//               ← Back to Dashboard
//             </button>
//           </div>

//           {error && (
//             <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
//               <p className="text-red-700">{error}</p>
//             </div>
//           )}

//           {success && (
//             <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
//               <p className="text-green-700">{success}</p>
//             </div>
//           )}

//           <div className="space-y-6">
//             <div>
//               <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-1">
//                 Device ID to Delete*
//               </label>
//               <input
//                 type="text"
//                 id="deviceId"
//                 name="deviceId"
//                 value={deviceId}
//                 onChange={(e) => setDeviceId(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
//                 required
//                 placeholder="Enter device ID (e.g., 15)"
//               />
//             </div>

//             <div className="flex justify-end">
//               <button
//                 onClick={handleDelete}
//                 disabled={loading || !deviceId}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
//               >
//                 {loading ? 'Deleting...' : 'Delete Device'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
//Removes hook error and makes it dynamic
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceService } from '../../lib/api/devices';

interface UserInfo {
  userId: number;
  houseId: number;
  role: string;
}

export default function DeleteDevicePage() {
  const router = useRouter();
  const [state, setState] = useState({
    deviceId: '',
    loading: false,
    error: null as string | null,
    success: null as string | null,
    token: null as string | null,
    userInfo: null as UserInfo | null,
    initialized: false
  });

  useEffect(() => {
    const loadAuthData = () => {
      try {
        const jwtToken = localStorage.getItem('jwt');
        const storedUserInfo = localStorage.getItem('user');

        if (!jwtToken || !storedUserInfo) {
          router.push('/login');
          return;
        }

        const parsedUserInfo = JSON.parse(storedUserInfo) as UserInfo;
        setState(prev => ({
          ...prev,
          token: jwtToken,
          userInfo: parsedUserInfo,
          initialized: true
        }));

      } catch (err) {
        console.error('Error loading auth data:', err);
        router.push('/login');
      }
    };

    loadAuthData();
  }, [router]);

  const handleDelete = async () => {
    if (!state.deviceId) {
      setState(prev => ({ ...prev, error: 'Please enter a device ID' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null, success: null }));

    try {
      if (!state.token || !state.userInfo) {
        throw new Error('Session expired. Please login again.');
      }

      if (state.userInfo.role !== 'ROLE_HOUSE_OWNER') {
        throw new Error('Only house owners can delete devices');
      }

      const result = await DeviceService.deleteDevice(
        parseInt(state.deviceId), 
        state.token
      );
      
      setState(prev => ({
        ...prev,
        success: result.message || `Device ${state.deviceId} deleted successfully!`,
        deviceId: ''
      }));

      setTimeout(() => router.push('/device-dashboard'), 2500);
    } catch (err: any) {
      console.error('Delete device error:', err);
      setState(prev => ({
        ...prev,
        error: err.message || 'Failed to delete device'
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  if (state.userInfo.role !== 'ROLE_HOUSE_OWNER') {
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

          {state.error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{state.error}</p>
            </div>
          )}

          {state.success && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">{state.success}</p>
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
                value={state.deviceId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                required
                placeholder="Enter device ID (e.g., 15)"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleDelete}
                disabled={state.loading || !state.deviceId}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                {state.loading ? 'Deleting...' : 'Delete Device'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}