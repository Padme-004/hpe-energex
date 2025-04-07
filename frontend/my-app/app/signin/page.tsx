// 'use client';
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../context/AuthContext';

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

// const SignInPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
  
//   const router = useRouter();
//   const { login } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
  
//     try {
//       const response = await fetch('http://localhost:8080/api/users/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       const authHeader = response.headers.get('Authorization');
//       const accessToken = authHeader ? authHeader.replace('Bearer ', '') : data.accessToken;
  
//       if (!accessToken) {
//         throw new Error('No access token received');
//       }

//       const decoded = decodeToken(accessToken);
//       if (!decoded) {
//         throw new Error('Received invalid token format');
//       }

//       login(accessToken, {
//         userId: decoded.userId,
//         houseId: decoded.houseId,
//         email: decoded.email,
//         username: decoded.username,
//         role: decoded.role,
//       });

//       router.push('/');
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Login failed');
//       console.error('Login error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSignUp = () => {
//     router.push('/signup');
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white p-4">
//       <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
//         <h1 className="text-3xl font-bold mb-4" style={{ color: '#008080' }}>Get Started with EnerGex</h1>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <input
//               type="email"
//               placeholder="Email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//             />
//           </div>
          
//           <div>
//             <input
//               type="password"
//               placeholder="Password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//             />
//           </div>
          
//           {error && (
//             <div className="text-red-500 text-sm text-center">
//               {error}
//             </div>
//           )}
          
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition duration-300 disabled:opacity-50"
//           >
//             {isLoading ? 'Signing In...' : 'Sign In'}
//           </button>
//         </form>
        
//         <div className="mt-4 text-center">
//           <button
//             onClick={handleSignUp}
//             className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition duration-300"
//           >
//             Create an Account
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignInPage;
'use client';
import React, { useState } from 'react';
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
  
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch('https://energy-optimisation-backend.onrender.com/api/users/login', {
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

      login(accessToken, {
        userId: decoded.userId,
        houseId: decoded.houseId,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role,
      });

      router.push('/');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleForgotPassword = () => {
    router.push('/forgotpassword'); // Make sure this route exists in your app
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#008080' }}>Get Started with EnerGex</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <div className="space-y-2">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-teal-600 hover:text-teal-800 hover:underline focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={handleSignUp}
            className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition duration-300"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;