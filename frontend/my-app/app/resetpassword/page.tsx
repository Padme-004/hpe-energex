'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserService } from '../lib/api/users';

export default function ResetPasswordPage() {
  // All hooks declared unconditionally at the top
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    token: searchParams.get('token') || '',
    newPassword: '',
    confirmPassword: ''
  });
  const [uiState, setUiState] = useState({
    isLoading: false,
    error: '',
    success: false
  });

  // Auto-fill token from URL if present
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setFormData(prev => ({ ...prev, token: urlToken }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUiState(prev => ({ ...prev, isLoading: true, error: '' }));

    // Client-side validation
    if (!formData.token || !formData.newPassword || !formData.confirmPassword) {
      setUiState(prev => ({ ...prev, error: 'All fields are required', isLoading: false }));
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setUiState(prev => ({ ...prev, error: 'Passwords do not match', isLoading: false }));
      return;
    }

    if (formData.newPassword.length < 8) {
      setUiState(prev => ({ ...prev, error: 'Password must be at least 8 characters', isLoading: false }));
      return;
    }

    try {
      await UserService.resetPassword({
        token: formData.token,
        newPassword: formData.newPassword
      });

      setUiState(prev => ({ ...prev, success: true }));
      setFormData({ token: '', newPassword: '', confirmPassword: '' });

      setTimeout(() => router.push('/signin'), 3000);
    } catch (err) {
      setUiState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to reset password',
        isLoading: false
      }));
      console.error('Reset password error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-teal-800">Reset Your Password</h1>
          <p className="text-gray-700 mb-6">
            {formData.token ? 'Enter your new password' : 'Enter the token and your new password'}
          </p>

          {uiState.error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              {uiState.error}
            </div>
          )}

          {uiState.success ? (
            <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              <p>Password reset successful! Redirecting to login...</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {!searchParams.get('token') && (
                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                    Token
                  </label>
                  <input
                    type="text"
                    id="token"
                    name="token"
                    value={formData.token}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter your token"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="New Password (min 8 characters)"
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Confirm Password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={uiState.isLoading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                  uiState.isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uiState.isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/signin" className="font-medium text-teal-600 hover:text-teal-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white shadow-md mt-8 py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-sm text-gray-700 text-center md:text-left">
              <p>Contact: <a href="mailto:support@example.com" className="text-teal-600 hover:text-teal-800">support@example.com</a></p>
              <p>© {new Date().getFullYear()} AMDS. All rights reserved</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/terms" className="text-sm text-gray-600 hover:text-teal-600">Terms</Link>
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-teal-600">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}