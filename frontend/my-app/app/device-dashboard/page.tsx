//Next implementation is with Add Device API
// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';

// interface Device {
//   deviceId: number;
//   deviceName: string;
//   deviceType: string;
//   status: string;
//   powerUsage: number;
//   houseId: number;
// }

// export default function DeviceDashboard() {
//   const [devices, setDevices] = useState<Device[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const { token, logout } = useAuth();

//   const fetchDevices = async () => {
//     try {
//       const response = await fetch('https://energy-optimisation-backend.onrender.com/api/devices', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 401) {
//         logout();
//         throw new Error('Session expired. Please login again.');
//       }

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setDevices(data.content || data); // Handle both {content: [...]} and direct array responses
//     } catch (err: any) {
//       console.error('Failed to fetch devices:', err);
//       setError(err.message || 'Failed to load devices.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateDeviceStatus = async (deviceId: number, newStatus: string) => {
//     try {
//       setError(null);
//       setSuccess(null);
      
//       const response = await fetch(`https://energy-optimisation-backend.onrender.com/api/devices/${deviceId}/status`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           status: newStatus 
//         }),
//       });

//       if (response.status === 401) {
//         logout();
//         throw new Error('Your session has expired. Please log in again.');
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to update device status');
//       }

//       setDevices(devices.map(device => 
//         device.deviceId === deviceId ? { ...device, status: newStatus } : device
//       ));
//       setSuccess(`Device ${deviceId} status updated to ${newStatus}`);
//     } catch (err: any) {
//       console.error('Update error:', err);
//       setError(err.message || 'Failed to update device status.');
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchDevices();
//     }
//   }, [token]);

//   if (loading) return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <main className="flex-grow container mx-auto px-6 py-8">
//         <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
//           <div className="text-center py-8">
//             <p className="text-gray-700">Loading devices...</p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );

//   if (error) return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <main className="flex-grow container mx-auto px-6 py-8">
//         <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
//           <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
//             <p className="text-red-700">{error}</p>
//           </div>
//           <button 
//             onClick={() => {
//               setError(null);
//               fetchDevices();
//             }}
//             className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </main>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <main className="flex-grow container mx-auto px-6 py-8">
//         <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
//           <h1 className="text-3xl font-bold mb-6" style={{ color: '#008080' }}>Device Dashboard</h1>
          
//           {success && (
//             <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
//               <p className="text-green-700">{success}</p>
//             </div>
//           )}

//           <div className="overflow-x-auto">
//             <table className="min-w-full border border-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Device ID</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Type</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Power Usage (W)</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">House ID</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {devices.map((device) => (
//                   <tr key={device.deviceId} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{device.deviceId}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{device.deviceName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{device.deviceType}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{device.powerUsage}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{device.houseId}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         device.status === 'ON' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {device.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
//                       <button
//                         onClick={() => updateDeviceStatus(device.deviceId, device.status === 'ON' ? 'OFF' : 'ON')}
//                         className={`px-3 py-1 rounded text-white text-sm ${
//                           device.status === 'ON' 
//                             ? 'bg-red-600 hover:bg-red-700' 
//                             : 'bg-green-600 hover:bg-green-700'
//                         }`}
//                       >
//                         {device.status === 'ON' ? 'Turn OFF' : 'Turn ON'}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Device {
  deviceId: number;
  deviceName: string;
  deviceType: string;
  powerRating: string;
  location: string;
  status: string;
  houseId: number;
}

export default function DeviceDashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { token } = useAuth();

  const [newDevice, setNewDevice] = useState({
    deviceName: '',
    deviceType: '',
    powerRating: '',
    location: ''
  });

  const fetchDevices = async () => {
    try {
      const response = await fetch('https://energy-optimisation-backend.onrender.com/api/devices', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const message = response.status === 401
          ? 'Session expired or unauthorized. Please check your credentials.'
          : `HTTP error! status: ${response.status}`;
        throw new Error(message);
      }

      const data = await response.json();
      setDevices(data.content || data);
    } catch (err: any) {
      console.error('Failed to fetch devices:', err);
      setError(err.message || 'Failed to load devices.');
    } finally {
      setLoading(false);
    }
  };

  const updateDeviceStatus = async (deviceId: number, newStatus: string) => {
    try {
      setError(null);
      setSuccess(null);

      const response = await fetch(`https://energy-optimisation-backend.onrender.com/api/devices/${deviceId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = response.status === 401
          ? 'Unauthorized. Please re-authenticate.'
          : errorData.message || 'Failed to update device status';
        throw new Error(message);
      }

      setDevices(devices.map(device =>
        device.deviceId === deviceId ? { ...device, status: newStatus } : device
      ));
      setSuccess(`Device ${deviceId} status updated to ${newStatus}`);
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update device status.');
    }
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      const response = await fetch('https://energy-optimisation-backend.onrender.com/api/devices', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDevice),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = response.status === 401
          ? 'Unauthorized. Please check your credentials.'
          : errorData.message || 'Failed to add device';
        throw new Error(message);
      }

      const addedDevice = await response.json();
      setDevices([...devices, addedDevice]);
      setSuccess(`Device "${newDevice.deviceName}" added successfully`);
      setNewDevice({
        deviceName: '',
        deviceType: '',
        powerRating: '',
        location: ''
      });
      setShowAddForm(false);
    } catch (err: any) {
      console.error('Add device error:', err);
      setError(err.message || 'Failed to add device.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDevice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (token) {
      fetchDevices();
    }
  }, [token]);

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-700">Loading devices...</p>
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
              fetchDevices();
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-teal-700">Device Dashboard</h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              {showAddForm ? 'Cancel' : 'Add New Device'}
            </button>
          </div>

          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {showAddForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4 text-teal-700">Add New Device</h2>
              <form onSubmit={handleAddDevice}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Device Name</label>
                    <input
                      type="text"
                      name="deviceName"
                      value={newDevice.deviceName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
                    <select
                      name="deviceType"
                      value={newDevice.deviceType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Appliance">Appliance</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Electronics">Electronics</option>
                      <option value="HVAC">HVAC</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Power Rating</label>
                    <input
                      type="text"
                      name="powerRating"
                      value={newDevice.powerRating}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                      placeholder="e.g., 250W"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={newDevice.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                      placeholder="e.g., Kitchen"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Add Device
                </button>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Device ID', 'Name', 'Type', 'Power Rating', 'Location', 'Status', 'Actions'].map((head) => (
                    <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devices.map((device) => (
                  <tr key={device.deviceId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{device.deviceId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{device.deviceName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{device.deviceType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{device.powerRating}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">{device.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        device.status === 'ON'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {device.status || 'OFF'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                      <button
                        onClick={() => updateDeviceStatus(device.deviceId, device.status === 'ON' ? 'OFF' : 'ON')}
                        className={`px-3 py-1 rounded text-white text-sm ${
                          device.status === 'ON'
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {device.status === 'ON' ? 'Turn OFF' : 'Turn ON'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
