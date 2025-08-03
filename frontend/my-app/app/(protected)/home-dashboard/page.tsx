'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { HouseService, House } from '../../lib/api/houses';

interface DashboardState {
  houses: House[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

export default function HousesDashboard() {
  // Consolidate state to prevent hook count mismatches
  const [state, setState] = useState<DashboardState>({
    houses: [],
    loading: true,
    error: null,
    success: null
  });

  const { token, logout } = useAuth();
  const router = useRouter();

  const navigate = useCallback((path: string) => () => router.push(path), [router]);

  const fetchHouses = useCallback(async () => {
    if (!token) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Authentication required'
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true }));
      const housesData = await HouseService.getHouses(token);
      setState(prev => ({
        ...prev,
        houses: housesData,
        loading: false,
        error: null
      }));
    } catch (err: any) {
      console.error('Failed to fetch houses:', err);
      if (err.message.includes('Unauthorized')) {
        logout();
        return;
      }
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to load houses'
      }));
    }
  }, [token, logout]);

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  const { houses, loading, error, success } = state;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-teal-800">Houses Dashboard</h1>
            <button
              onClick={navigate('/user-dashboard')}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm md:text-base font-medium shadow-md transition duration-200 w-full md:w-auto"
            >
              Users Dashboard
            </button>
          </div>
          
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={fetchHouses}
                className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Try Again
              </button>
            </div>
          )}

          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">House ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Location</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {houses.map((house) => (
                  <tr key={house.houseId} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{house.houseId}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{house.houseName}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{house.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={navigate('/add-home')}
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-xs sm:text-sm font-medium shadow-md transition duration-200"
              >
                Add Home
              </button>
              <button
                onClick={navigate('/home-detail')}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs sm:text-sm font-medium shadow-md transition duration-200"
              >
                Home Details
              </button>
              <button
                onClick={navigate('/delete-home')}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-xs sm:text-sm font-medium shadow-md transition duration-200"
              >
                Delete Home
              </button>
              <button
                onClick={navigate('/update-home')}
                className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs sm:text-sm font-medium shadow-md transition duration-200"
              >
                Update Home
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}