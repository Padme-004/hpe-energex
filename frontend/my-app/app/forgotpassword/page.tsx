'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserService } from '@/app/lib/api/users';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Handle redirect after success
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        router.push('/resetpassword');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await UserService.forgotPassword({ email });
      setMessage('Password reset link sent to your email! Redirecting...');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link');
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#008080' }}>Forgot your password?</h1>
          <p className="text-gray-700 mb-6">
            Enter your email and we'll send you a link to reset your password.
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {message && (
            <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              <p>{message}</p>
            </div>
          )}

          {!message && (
            <>
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
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-50"
                    style={{ backgroundColor: '#008080' }}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link 
                    href="/signin" 
                    className="font-medium text-teal-600 hover:text-teal-500"
                    style={{ color: '#008080' }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
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

export default ForgotPasswordPage;