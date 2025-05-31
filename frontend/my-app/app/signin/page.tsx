'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';

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

      localStorage.removeItem('jwt');
      localStorage.removeItem('token');
      localStorage.setItem('jwt', accessToken);

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
    router.push('/forgotpassword');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-12">
        {/* Image Placeholder - Left Side */}
        <div className="hidden md:block flex-1 h-[500px] bg-gray-100 rounded-xl overflow-hidden relative">
          {/* Replace this with your actual image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <h2 className="text-3xl font-bold mb-4 text-teal-600">Welcome to EnerGex</h2>
              <p className="text-gray-600 mb-6">Optimize your energy consumption with our AI-powered platform</p>
              {/* Placeholder for illustration - replace with actual Image component */}
              <div className="w-full h-64 bg-teal-50 rounded-lg flex items-center justify-center">
                <img src='signin.jpg' className='w-full h-64 bg-teal-50 rounded-lg flex items-center justify-center'></img>
              </div>
            </div>
          </div>
        </div>

        {/* Sign In Form - Right Side */}
        <div className="w-full md:w-1/2 lg:w-1/3 bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4 text-teal-600">Get Started with EnerGex</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-teal-500"
              />
            </div>

            <div className="space-y-2">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black focus:ring-2 focus:ring-teal-500"
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
    </div>
  );
};

export default SignInPage;