'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserService } from '../lib/api/users';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Client-side validation
    if (!token || !newPassword || !confirmPassword) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      await UserService.resetPassword({
        token,
        newPassword
      });

      setSuccess(true);
      setToken('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => router.push('/signin'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#008080' }}>Reset Your Password</h1>
          <p className="text-gray-700 mb-6">
            Enter the token sent to your email and your new password.
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {success ? (
            <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              <p>Password reset successful! Redirecting to login...</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700">Token</label>
                <input
                  type="text"
                  id="token"
                  name="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter your token"
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="New Password"
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Confirm Password"
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
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}

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
}