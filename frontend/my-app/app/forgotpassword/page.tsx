'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserService } from '../lib/api/users';

const ForgotPasswordPage = () => {
  // All hooks declared unconditionally first
  const [formState, setFormState] = useState({
    email: '',
    message: '',
    error: '',
    isLoading: false
  });
  const router = useRouter();

  // Handle redirect after success
  useEffect(() => {
    if (formState.message) {
      const timer = setTimeout(() => {
        router.push('/resetpassword');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formState.message, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      await UserService.forgotPassword({ email: formState.email });
      setFormState(prev => ({
        ...prev,
        message: 'Password reset link sent! Redirecting...',
        error: '',
        isLoading: false
      }));
    } catch (err) {
      setFormState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to send reset link',
        isLoading: false
      }));
      console.error('Password reset error:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-teal-800">Forgot your password?</h1>
          
          {/* Status Messages */}
          {formState.error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              {formState.error}
            </div>
          )}

          {formState.message ? (
            <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              {formState.message}
            </div>
          ) : (
            <>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState.isLoading}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${formState.isLoading ? 'opacity-50' : ''}`}
                >
                  {formState.isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link href="/signin" className="font-medium text-teal-600 hover:text-teal-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="bg-white shadow-md mt-8">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-700 mb-4 md:mb-0">
            <p>Contact: <a href="mailto:support@example.com" className="text-teal-600 hover:text-teal-800">support@example.com</a></p>
            <p>© {new Date().getFullYear()} AMDS. All rights reserved</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/terms" className="text-gray-600 hover:text-teal-600 text-sm">Terms</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-teal-600 text-sm">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;