// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { HouseService } from '../../lib/api/houses';

// export default function AddHomePage() {
//   // State declarations at the top (hook rule compliance)
//   const [home, setHome] = useState({
//     houseName: '',
//     location: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [houseId, setHouseId] = useState<number | null>(null);
//   const [authChecked, setAuthChecked] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const router = useRouter();

//   // Authentication check
//   useEffect(() => {
//     const jwtToken = localStorage.getItem('jwt');
//     const storedUserInfo = localStorage.getItem('user');

//     if (!jwtToken || !storedUserInfo) {
//       router.push('/login');
//       return;
//     }

//     try {
//       const parsedInfo = JSON.parse(storedUserInfo);
//       setIsAdmin(parsedInfo.role === 'ROLE_ADMIN');
//       setAuthChecked(true);
//     } catch (err) {
//       console.error('Error parsing user info:', err);
//       router.push('/login');
//     }
//   }, [router]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setHome(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const jwtToken = localStorage.getItem('jwt');
//     const currentUserInfo = localStorage.getItem('user');
    
//     if (!jwtToken || !currentUserInfo || JSON.parse(currentUserInfo).role !== 'ROLE_ADMIN') {
//       setError('Unauthorized: Only administrators can add homes');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const result = await HouseService.addHouse(
//         {
//           houseName: home.houseName,
//           location: home.location,
//         },
//         jwtToken
//       );

//       setSuccess('Home created successfully!');
//       setHouseId(result.houseId);
//       setTimeout(() => router.push('/home-dashboard'), 2500);
//     } catch (err: any) {
//       console.error('Add home error:', err);
//       setError(err.message || 'Failed to add home');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Loading state while checking auth
//   if (!authChecked) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//         <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
//           <p className="text-gray-700">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Permission check
//   if (!isAdmin) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//         <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//           <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
//             <p className="text-red-700">Only administrators can add homes</p>
//           </div>
//           <button 
//             onClick={() => router.push('/home-dashboard')}
//             className="w-full px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Main form render
//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//         {/* Header */}
//         <div className="p-6 bg-teal-700 text-white">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//             <h1 className="text-2xl font-bold">Add New Home</h1>
//             <button 
//               onClick={() => router.push('/home-dashboard')}
//               className="px-4 py-2 bg-white text-teal-700 rounded hover:bg-gray-100 text-sm font-medium"
//             >
//               ← Back to Dashboard
//             </button>
//           </div>
//         </div>

//         {/* Alerts */}
//         <div className="p-4">
//           {error && (
//             <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
//               <p className="text-red-700">{error}</p>
//             </div>
//           )}
//           {success && (
//             <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
//               <p className="text-green-700">{success}</p>
//               {houseId && (
//                 <p className="text-sm text-green-800 mt-1">
//                   Home ID: <span className="font-semibold">{houseId}</span>
//                 </p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
//           <div>
//             <label htmlFor="houseName" className="block text-sm font-medium text-gray-700 mb-1">
//               Home Name*
//             </label>
//             <input
//               type="text"
//               id="houseName"
//               name="houseName"
//               value={home.houseName}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
//               required
//               placeholder="My Lovely Home"
//             />
//           </div>

//           <div>
//             <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
//               Location*
//             </label>
//             <input
//               type="text"
//               id="location"
//               name="location"
//               value={home.location}
//               onChange={handleChange}
//               className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
//               required
//               placeholder="City, Country"
//             />
//           </div>

//           <div className="pt-2">
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors ${
//                 loading ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center">
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Creating...
//                 </span>
//               ) : 'Create Home'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HouseService } from '../../lib/api/houses';

export default function AddHomePage() {
  // All hooks declared at the top unconditionally
  const [home, setHome] = useState({
    houseName: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [houseId, setHouseId] = useState<number | null>(null);
  const [authState, setAuthState] = useState<'checking' | 'authenticated' | 'unauthenticated' | 'unauthorized'>('checking');
  
  const router = useRouter();

  // Authentication check with better state management
  useEffect(() => {
    const checkAuth = () => {
      const jwtToken = localStorage.getItem('jwt');
      const storedUserInfo = localStorage.getItem('user');

      if (!jwtToken || !storedUserInfo) {
        setAuthState('unauthenticated');
        return;
      }

      try {
        const parsedInfo = JSON.parse(storedUserInfo);
        if (parsedInfo.role === 'ROLE_ADMIN') {
          setAuthState('authenticated');
        } else {
          setAuthState('unauthorized');
        }
      } catch (err) {
        console.error('Error parsing user info:', err);
        setAuthState('unauthenticated');
      }
    };

    // Defer to next tick to avoid render conflicts
    setTimeout(checkAuth, 0);
  }, []);

  // Handle navigation in a separate effect
  useEffect(() => {
    if (authState === 'unauthenticated') {
      router.push('/login');
    }
  }, [authState, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHome(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const jwtToken = localStorage.getItem('jwt');
    const currentUserInfo = localStorage.getItem('user');
    
    if (!jwtToken || !currentUserInfo || JSON.parse(currentUserInfo).role !== 'ROLE_ADMIN') {
      setError('Unauthorized: Only administrators can add homes');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await HouseService.addHouse(
        {
          houseName: home.houseName,
          location: home.location,
        },
        jwtToken
      );

      setSuccess('Home created successfully!');
      setHouseId(result.houseId);
      setTimeout(() => router.push('/home-dashboard'), 2500);
    } catch (err: any) {
      console.error('Add home error:', err);
      setError(err.message || 'Failed to add home');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (authState === 'checking') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <p className="ml-3 text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if unauthenticated (navigation will happen)
  if (authState === 'unauthenticated') {
    return null;
  }

  // Permission check
  if (authState === 'unauthorized') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">Only administrators can add homes</p>
          </div>
          <button 
            onClick={() => router.push('/home-dashboard')}
            className="w-full px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Main form render (only when authenticated)
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-teal-700 text-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-2xl font-bold">Add New Home</h1>
            <button 
              onClick={() => router.push('/home-dashboard')}
              className="px-4 py-2 bg-white text-teal-700 rounded hover:bg-gray-100 text-sm font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="p-4">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
              <p className="text-green-700">{success}</p>
              {houseId && (
                <p className="text-sm text-green-800 mt-1">
                  Home ID: <span className="font-semibold">{houseId}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label htmlFor="houseName" className="block text-sm font-medium text-gray-700 mb-1">
              Home Name*
            </label>
            <input
              type="text"
              id="houseName"
              name="houseName"
              value={home.houseName}
              onChange={handleChange}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              required
              placeholder="My Lovely Home"
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
              value={home.location}
              onChange={handleChange}
              className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              required
              placeholder="City, Country"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : 'Create Home'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}