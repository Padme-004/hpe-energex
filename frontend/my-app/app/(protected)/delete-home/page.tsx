'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HouseService } from '../../lib/api/houses';

export default function DeleteHomePage() {
  const [homeId, setHomeId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const jwtToken = localStorage.getItem('jwt');
      const storedUserInfo = localStorage.getItem('user');

      if (!jwtToken || !storedUserInfo) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setAuthChecked(true);
        setTimeout(() => {
          router.push('/signin');
        }, 100);
        return;
      }

      try {
        const parsedInfo = JSON.parse(storedUserInfo);
        setIsAuthenticated(true);
        setIsAdmin(parsedInfo.role === 'ROLE_ADMIN');
        setAuthChecked(true);
      } catch (err) {
        console.error('Error parsing user info:', err);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setAuthChecked(true);
        setTimeout(() => {
          router.push('/signin');
        }, 100);
      }
    };

    checkAuth();
  }, [router]);

  const handleDelete = async () => {
    if (!homeId) {
      setError('Please enter a home ID');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const jwtToken = localStorage.getItem('jwt');
      if (!jwtToken) {
        throw new Error('Session expired. Please login again.');
      }

      await HouseService.deleteHouse(homeId, jwtToken);
      
      setSuccess(`Home ${homeId} deleted successfully!`);
      setHomeId('');
      setTimeout(() => router.push('/home-dashboard'), 2500);
    } catch (err: any) {
      console.error('Delete home error:', err);
      setError(err.message || 'Failed to delete home');
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <p className="text-gray-700">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">Only administrators can delete homes</p>
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-teal-700 text-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-2xl font-bold">Delete Home</h1>
            <button 
              onClick={() => router.push('/home-dashboard')}
              className="px-4 py-2 bg-white text-teal-700 rounded hover:bg-gray-100 text-sm font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        <div className="p-4">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
              <p className="text-green-700">{success}</p>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <label htmlFor="homeId" className="block text-sm font-medium text-gray-700 mb-1">
              Home ID to Delete*
            </label>
            <input
              type="text"
              id="homeId"
              name="homeId"
              value={homeId}
              onChange={(e) => setHomeId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              required
              placeholder="Enter home ID (e.g., 2)"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleDelete}
              disabled={loading || !homeId}
              className={`w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors ${
                loading || !homeId ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : 'Delete Home'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}