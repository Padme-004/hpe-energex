//Updated code has change status option
// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';

// interface User {
//   userId: number;
//   email: string;
//   anonymousName: string;
//   profileStatus: string;
// }

// export default function UserDashboard() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { token } = useAuth();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch('https://energy-optimisation-backend.onrender.com/api/users/all', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         setUsers(data.content); // only use the 'content' array
//       } catch (err: any) {
//         console.error('Failed to fetch users:', err);
//         setError('Failed to load users.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchUsers();
//     }
//   }, [token]);

//   if (loading) return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <main className="flex-grow container mx-auto px-6 py-8">
//         <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
//           <div className="text-center py-8">
//             <p className="text-gray-700">Loading users...</p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );

//   if (error) return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <main className="flex-grow container mx-auto px-6 py-8">
//         <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
//           <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
//             <p className="text-red-700">{error}</p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <main className="flex-grow container mx-auto px-6 py-8">
//         <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
//           <h1 className="text-3xl font-bold mb-6" style={{ color: '#008080' }}>User Dashboard</h1>
          
//           <div className="overflow-x-auto">
//             <table className="min-w-full border border-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">User ID</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Email</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {users.map((user) => (
//                   <tr key={user.userId} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{user.userId}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{user.email}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{user.anonymousName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{user.profileStatus}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface User {
  userId: number;
  email: string;
  anonymousName: string;
  profileStatus: string;
}

export default function UserDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { token, logout } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://energy-optimisation-backend.onrender.com/api/users/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        logout();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.content);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (userId: number, newStatus: string) => {
    try {
      setError(null);
      setSuccess(null);
      
      const response = await fetch('https://energy-optimisation-backend.onrender.com/api/users/profile-status', {
        method: 'PUT', // Changed from POST to PUT
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId,
          profileStatus: newStatus 
        }),
      });

      if (response.status === 401) {
        logout();
        throw new Error('Your session has expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }

      setUsers(users.map(user => 
        user.userId === userId ? { ...user, profileStatus: newStatus } : user
      ));
      setSuccess(`Status updated to ${newStatus} for user ${userId}`);
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update status. Please check your permissions.');
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center py-8">
            <p className="text-gray-700">Loading users...</p>
          </div>
        </div>
      </main>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
          <button 
            onClick={() => {
              setError(null);
              fetchUsers();
            }}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Try Again
          </button>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6" style={{ color: '#008080' }}>User Dashboard</h1>
          
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{user.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{user.anonymousName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.profileStatus === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.profileStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                      <select
                        value={user.profileStatus}
                        onChange={(e) => updateStatus(user.userId, e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
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