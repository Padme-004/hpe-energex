'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { HouseService, House } from '../../lib/api/houses';

export default function HousesDashboard() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { token, logout } = useAuth();
  const router = useRouter();

  // Navigation functions
  const navigateToUserDashboard = () => router.push('/user-dashboard');
  const navigateToAddHome = () => router.push('/add-home');
  const navigateToHomeDetails = () => router.push('/home-detail');
  const navigateToDeleteHome = () => router.push('/delete-home');
  const navigateToUpdateHome = () => router.push('/update-home');

  const fetchHouses = async () => {
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }

      const housesData = await HouseService.getHouses(token);
      setHouses(housesData);
    } catch (err: any) {
      console.error('Failed to fetch houses:', err);
      if (err.message.includes('Unauthorized')) {
        logout();
      }
      setError(err.message || 'Failed to load houses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHouses();
    }
  }, [token]);

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center py-8">
            <p className="text-gray-700">Loading houses...</p>
          </div>
        </div>
      </main>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
          <button 
            onClick={() => {
              setError(null);
              fetchHouses();
            }}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Try Again
          </button>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6" style={{ color: '#008080' }}>Houses Dashboard</h1>
          
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">House ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Location</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {houses.map((house) => (
                  <tr key={house.houseId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{house.houseId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{house.houseName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{house.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-8">
            <div className="flex space-x-4">
              <button
                onClick={navigateToAddHome}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium shadow-md transition duration-200"
              >
                Add Home
              </button>
              <button
                onClick={navigateToHomeDetails}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium shadow-md transition duration-200"
              >
                Home Details
              </button>
              <button
                onClick={navigateToDeleteHome}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium shadow-md transition duration-200"
              >
                Delete Home
              </button>
              <button
                onClick={navigateToUpdateHome}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-medium shadow-md transition duration-200"
              >
                Update Home
              </button>
            </div>
            <button
              onClick={navigateToUserDashboard}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-lg font-medium shadow-md transition duration-200"
            >
              Users Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}