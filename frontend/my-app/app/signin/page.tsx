// 'use client'; //Sign in page with jwt, next version tries to store access token too
// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setToken } from '../features/authSlice';
// import { useRouter } from 'next/navigation';
// import type { RootState } from '../store/store';

// // JWT Decoding Helper Function with proper typing
// interface DecodedToken {
//   userId: number;
//   houseId: number;
//   email: string;
//   username: string;
//   role: string;
//   iat?: number;
//   exp?: number;
// }

// const decodeToken = (token: string): DecodedToken | null => {
//   if (!token) return null;
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     return JSON.parse(atob(base64));
//   } catch (error) {
//     console.error('Error decoding token:', error);
//     return null;
//   }
// };

// const SignInPage: React.FC = () => {
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [error, setError] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);
  
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const authState = useSelector((state: RootState) => state.auth);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
  
//     try {
//       const response = await fetch('http://localhost:8080/api/users/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include', // Still maintains cookie-based auth
//         body: JSON.stringify({ email, password }),
//       });
  
//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }
  
//       // Extract token from either Authorization header or response body
//       const authHeader = response.headers.get('Authorization');
//       const accessToken = authHeader ? authHeader.replace('Bearer ', '') : data.accessToken;
  
//       if (!accessToken) {
//         throw new Error('No access token received');
//       }
  
//       const decoded = decodeToken(accessToken);
//       if (!decoded) {
//         throw new Error('Received invalid token format');
//       }
  
//       // Store token in localStorage (added)
//       localStorage.setItem('jwt', accessToken);
      
//       // Also store in Redux
//       dispatch(setToken({
//         token: accessToken,
//         user: {
//           userId: decoded.userId,
//           houseId: decoded.houseId,
//           email: decoded.email,
//           username: decoded.username,
//           role: decoded.role,
//         }
//       }));
  
//       router.push('/');
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Login failed');
//       console.error('Login error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       {/* Main Content */}
//       <main className="flex-grow container mx-auto px-6 py-8">
//         <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
//           <h1 className="text-3xl font-bold mb-4" style={{ color: '#008080' }}>Login to your EnerGex Account</h1>
//           <p className="text-gray-700 mb-8">
//             Save while contributing to the planet!
//           </p>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
//               <p>{error}</p>
//             </div>
//           )}

//           {/* Sign-In Form */}
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//                 required
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//                 required
//               />
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-50"
//                 style={{ backgroundColor: '#008080' }}
//               >
//                 {isLoading ? 'Signing in...' : 'Sign In'}
//               </button>
//             </div>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">Don't have an account?</p>
//             <div>
//               <button
//                 type="button"
//                 onClick={() => router.push('/signup')}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white mt-2"
//                 style={{ backgroundColor: '#008080' }}
//               >
//                 Sign Up
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white shadow-md mt-8">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="text-sm text-gray-700">
//               <p>Contact Details: <a href="mailto:nemr22ad06@emamit" className="hover:text-teal-800" style={{ color: '#008080' }}>nemr22ad06@emamit</a> | <a href="tel:911-9743282090" className="hover:text-teal-800" style={{ color: '#008080' }}>911-9743282090</a></p>
//               <p>AMDS 2025 All rights reserved</p>
//             </div>
//             <div className="flex space-x-4">
//               <a href="#" className="text-gray-400 hover:text-teal-800">Terms & Conditions</a>
//               <a href="#" className="text-gray-400 hover:text-teal-800">Privacy Policy</a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default SignInPage;
'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '../features/authSlice';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface DecodedToken {
  userId: number;
  houseId: number;
  email: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

const decodeToken = (token: string): DecodedToken | null => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { setAccessToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const authHeader = response.headers.get('Authorization');
      const accessToken = authHeader ? authHeader.replace('Bearer ', '') : data.accessToken;
  
      if (!accessToken) {
        throw new Error('No access token received');
      }

      const decoded = decodeToken(accessToken);
      if (!decoded) {
        throw new Error('Received invalid token format');
      }

      // Update all authentication systems
      localStorage.setItem('jwt', accessToken);
      dispatch(setToken({
        token: accessToken,
        user: {
          userId: decoded.userId,
          houseId: decoded.houseId,
          email: decoded.email,
          username: decoded.username,
          role: decoded.role,
        }
      }));
      setAccessToken(accessToken);

      router.push('/');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#008080' }}>Login to your EnerGex Account</h1>
          <p className="text-gray-700 mb-8">
            Save while contributing to the planet!
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: '#008080' }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Don't have an account?</p>
            <div>
              <button
                type="button"
                onClick={() => router.push('/signup')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white mt-2"
                style={{ backgroundColor: '#008080' }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white shadow-md mt-8">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              <p>Contact Details: <a href="mailto:nemr22ad06@emamit" className="hover:text-teal-800" style={{ color: '#008080' }}>nemr22ad06@emamit</a> | <a href="tel:911-9743282090" className="hover:text-teal-800" style={{ color: '#008080' }}>911-9743282090</a></p>
              <p>AMDS 2025 All rights reserved</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-teal-800">Terms & Conditions</a>
              <a href="#" className="text-gray-400 hover:text-teal-800">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignInPage;