// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { UserService } from '../../lib/api/users';

// export default function ChangePasswordPage() {
//   // State declarations at the top (hook rule compliance)
//   const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
//   const [message, setMessage] = useState({ text: '', isError: false });
//   const [isLoading, setIsLoading] = useState(false);
//   const [authChecked, setAuthChecked] = useState(false);
//   const router = useRouter();

//   // Check authentication status
//   useEffect(() => {
//     const token = localStorage.getItem('jwt');
//     if (!token) {
//       router.push('/login');
//     } else {
//       setAuthChecked(true);
//     }
//   }, [router]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Client-side validation
//     if (!form.oldPassword || !form.newPassword) {
//       setMessage({ text: 'Both fields are required', isError: true });
//       return;
//     }

//     if (form.oldPassword === form.newPassword) {
//       setMessage({ text: 'New password must be different from current password', isError: true });
//       return;
//     }

//     if (form.newPassword.length < 8) {
//       setMessage({ text: 'Password must be at least 8 characters', isError: true });
//       return;
//     }

//     setIsLoading(true);
//     setMessage({ text: '', isError: false });

//     try {
//       const token = localStorage.getItem('jwt');
//       if (!token) {
//         throw new Error('Session expired. Please login again.');
//       }

//       const responseText = await UserService.changePassword(form, token);
//       setMessage({ text: responseText, isError: false });
//       setForm({ oldPassword: '', newPassword: '' });
      
//       // Redirect after success
//       setTimeout(() => router.push('/profile'), 2000);
//     } catch (err) {
//       setMessage({ 
//         text: err instanceof Error ? err.message : 'Failed to change password', 
//         isError: true 
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   if (!authChecked) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
//           <p className="text-gray-700">Checking authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
//         {/* Header */}
//         <div className="bg-teal-700 p-6 text-white">
//           <h1 className="text-2xl md:text-3xl font-bold">Change Password</h1>
//           <p className="mt-2 text-teal-100">For security, change your password occasionally.</p>
//         </div>

//         {/* Message Alert */}
//         {message.text && (
//           <div className={`p-4 ${message.isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
//             <p>{message.text}</p>
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-5">
//           <div className="space-y-2">
//             <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
//               Current Password
//             </label>
//             <input
//               type="password"
//               id="oldPassword"
//               name="oldPassword"
//               value={form.oldPassword}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//               required
//               autoComplete="current-password"
//             />
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
//               New Password
//             </label>
//             <input
//               type="password"
//               id="newPassword"
//               name="newPassword"
//               value={form.newPassword}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//               required
//               minLength={8}
//               autoComplete="new-password"
//             />
//             <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
//           </div>

//           <div className="pt-2">
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors ${
//                 isLoading ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//             >
//               {isLoading ? (
//                 <span className="flex items-center justify-center">
//                   <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Changing...
//                 </span>
//               ) : 'Change Password'}
//             </button>
//           </div>
//         </form>

//         {/* Footer */}
//         <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
//           <Link 
//             href="/profile" 
//             className="text-sm text-teal-700 hover:text-teal-900 font-medium"
//           >
//             ← Back to Profile
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserService } from '../../lib/api/users';

export default function ChangePasswordPage() {
  // All hooks declared at the top level - this is correct
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [message, setMessage] = useState({ text: '', isError: false });
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        setIsAuthenticated(false);
        setAuthChecked(true);
        // Don't immediately redirect, let the component render first
        setTimeout(() => router.push('/login'), 100);
      } else {
        setIsAuthenticated(true);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!form.oldPassword || !form.newPassword) {
      setMessage({ text: 'Both fields are required', isError: true });
      return;
    }

    if (form.oldPassword === form.newPassword) {
      setMessage({ text: 'New password must be different from current password', isError: true });
      return;
    }

    if (form.newPassword.length < 8) {
      setMessage({ text: 'Password must be at least 8 characters', isError: true });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', isError: false });

    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('Session expired. Please login again.');
      }

      const responseText = await UserService.changePassword(form, token);
      setMessage({ text: responseText, isError: false });
      setForm({ oldPassword: '', newPassword: '' });
      
      // Redirect after success
      setTimeout(() => router.push('/profile'), 2000);
    } catch (err) {
      setMessage({ 
        text: err instanceof Error ? err.message : 'Failed to change password', 
        isError: true 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Show loading state while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-700">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-700">Access denied. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-teal-700 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Change Password</h1>
          <p className="mt-2 text-teal-100">For security, change your password occasionally.</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`p-4 ${message.isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            <p>{message.text}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
              minLength={8}
              autoComplete="new-password"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Changing...
                </span>
              ) : 'Change Password'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
          <Link 
            href="/" 
            className="text-sm text-teal-700 hover:text-teal-900 font-medium"
          >
            ← Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}