'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { ApiKey, ApiKeyService } from '@/app/lib/api/apiKey';

interface DecodedToken {
  role: string;
  userId: number;
}

export default function ManageKeys() {
  const { token } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKey, setNewKey] = useState<ApiKey | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Separate loading states for each operation
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [toggleLoading, setToggleLoading] = useState<boolean>(false);
  const [getLoading, setGetLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  
  // Separate state for each input field
  const [toggleKeyId, setToggleKeyId] = useState<string>('');
  const [getKeyId, setGetKeyId] = useState<string>('');
  const [deleteKeyId, setDeleteKeyId] = useState<string>('');

  const [keyForm, setKeyForm] = useState({
    name: '',
    description: '',
    expiresAt: '',
    active: true
  });

  useEffect(() => {
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setIsAdmin(decoded.role === 'ROLE_ADMIN');
      } catch (err) {
        console.error('Token decoding failed:', err);
      }
    }
  }, [token]);

  const handleCreateKey = async () => {
    if (!keyForm.name) {
      setMessage('Name is required');
      return;
    }

    setCreateLoading(true);
    setMessage('');
    try {
      const createdKey = await ApiKeyService.createApiKey(token!, {
        name: keyForm.name,
        description: keyForm.description,
        expiresAt: keyForm.expiresAt,
        active: keyForm.active
      });
      
      setNewKey(createdKey);
      setMessage('API key created successfully!');
      setKeyForm({
        name: '',
        description: '',
        expiresAt: '',
        active: true
      });
    } catch (error: any) {
      setMessage(error.message || 'Error creating API key');
      console.error('Error:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const fetchAllKeys = async () => {
    setFetchLoading(true);
    setMessage('');
    try {
      const keys = await ApiKeyService.getAllApiKeys(token!);
      setApiKeys(keys);
      setMessage(`Found ${keys.length} API keys`);
    } catch (error: any) {
      setMessage(error.message || 'Error fetching API keys');
      console.error('Error:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const toggleKeyStatus = async () => {
    if (!toggleKeyId) {
      setMessage('Please enter an API key ID');
      return;
    }

    setToggleLoading(true);
    setMessage('');
    try {
      await ApiKeyService.toggleApiKeyStatus(token!, toggleKeyId);
      setMessage('API key status toggled successfully!');
      fetchAllKeys();
      setToggleKeyId('');
    } catch (error: any) {
      setMessage(error.message || 'Error toggling API key status');
      console.error('Error:', error);
    } finally {
      setToggleLoading(false);
    }
  };

  const getKeyById = async () => {
    if (!getKeyId) {
      setMessage('Please enter an API key ID');
      return;
    }

    setGetLoading(true);
    setMessage('');
    try {
      const key = await ApiKeyService.getApiKeyById(token!, getKeyId);
      setApiKeys([key]);
      setMessage('API key retrieved successfully');
      setGetKeyId('');
    } catch (error: any) {
      setMessage(error.message || 'Error fetching API key');
      setApiKeys([]);
      console.error('Error:', error);
    } finally {
      setGetLoading(false);
    }
  };

  const deleteKey = async () => {
    if (!deleteKeyId) {
      setMessage('Please enter an API key ID');
      return;
    }

    setDeleteLoading(true);
    setMessage('');
    try {
      await ApiKeyService.deleteApiKey(token!, deleteKeyId);
      setMessage('API key deleted successfully!');
      fetchAllKeys();
      setDeleteKeyId('');
    } catch (error: any) {
      setMessage(error.message || 'Error deleting API key');
      console.error('Error:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center" style={{ borderTop: '4px solid #008080' }}>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Access Denied</h2>
          <p className="text-gray-600">You must be an administrator to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800" style={{ color: '#008080' }}>API Key Management</h1>
        
        {message && (
          <div className={`p-4 mb-6 rounded-md ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ borderTop: '4px solid #008080' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#008080' }}>Create New API Key</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="keyName" className="block text-gray-700 font-medium mb-2">Name *</label>
              <input
                type="text"
                id="keyName"
                className="text-black w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={keyForm.name}
                onChange={(e) => setKeyForm({...keyForm, name: e.target.value})}
                placeholder="e.g., Production Key"
                required
              />
            </div>
            
            <div>
              <label htmlFor="keyDescription" className="block text-gray-700 font-medium mb-2">Description</label>
              <input
                type="text"
                id="keyDescription"
                className="text-black w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={keyForm.description}
                onChange={(e) => setKeyForm({...keyForm, description: e.target.value})}
                placeholder="e.g., For mobile app integration"
              />
            </div>
            
            <div>
              <label htmlFor="keyExpiry" className="block text-gray-700 font-medium mb-2">Expiration Date</label>
              <input
                type="datetime-local"
                id="keyExpiry"
                className="w-full text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={keyForm.expiresAt}
                onChange={(e) => setKeyForm({...keyForm, expiresAt: e.target.value})}
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="keyActive"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                checked={keyForm.active}
                onChange={(e) => setKeyForm({...keyForm, active: e.target.checked})}
              />
              <label htmlFor="keyActive" className="ml-2 block text-gray-700 font-medium">
                Active
              </label>
            </div>
          </div>
          
          <button
            onClick={handleCreateKey}
            disabled={createLoading || !keyForm.name}
            className={`px-4 py-2 rounded-md text-white font-medium ${createLoading || !keyForm.name ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            {createLoading ? 'Creating...' : 'Generate API Key'}
          </button>
          
          {newKey && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Key Name</label>
                  <div className="p-2 bg-gray-50 rounded-md text-black">{newKey.name}</div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Status</label>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <span className={`px-2 py-1 rounded-full text-xs ${newKey.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {newKey.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-1">API Key Value</label>
                <div className="p-3 bg-gray-100 rounded-md font-mono break-all text-black">{newKey.keyValue}</div>
                <p className="mt-2 text-sm text-red-600 font-medium">Important: Copy this key now. It won't be shown again.</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ borderTop: '4px solid #008080' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#008080' }}>Retrieve All API Keys</h2>
          <button
            onClick={fetchAllKeys}
            disabled={fetchLoading}
            className={`px-4 py-2 rounded-md text-white font-medium ${fetchLoading ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            {fetchLoading ? 'Loading...' : 'Get All Keys'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ borderTop: '4px solid #008080' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#008080' }}>Toggle API Key Status</h2>
          <div className="mb-4">
            <label htmlFor="toggleKeyId" className="block text-gray-700 font-medium mb-2">API Key ID</label>
            <input
              type="text"
              id="toggleKeyId"
              className="text-black w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={toggleKeyId}
              onChange={(e) => setToggleKeyId(e.target.value)}
              placeholder="Enter API key ID"
            />
          </div>
          <button
            onClick={toggleKeyStatus}
            disabled={toggleLoading || !toggleKeyId}
            className={`px-4 py-2 rounded-md text-white font-medium ${toggleLoading || !toggleKeyId ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            {toggleLoading ? 'Processing...' : 'Toggle Key Status'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ borderTop: '4px solid #008080' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#008080' }}>Get API Key by ID</h2>
          <div className="mb-4">
            <label htmlFor="getKeyId" className="block text-gray-700 font-medium mb-2">API Key ID</label>
            <input
              type="text"
              id="getKeyId"
              className="text-black w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={getKeyId}
              onChange={(e) => setGetKeyId(e.target.value)}
              placeholder="Enter API key ID"
            />
          </div>
          <button
            onClick={getKeyById}
            disabled={getLoading || !getKeyId}
            className={`px-4 py-2 rounded-md text-white font-medium ${getLoading || !getKeyId ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            {getLoading ? 'Fetching...' : 'Get Key'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ borderTop: '4px solid #008080' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#008080' }}>Delete API Key</h2>
          <div className="mb-4">
            <label htmlFor="deleteKeyId" className="block text-gray-700 font-medium mb-2">API Key ID</label>
            <input
              type="text"
              id="deleteKeyId"
              className="text-black w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={deleteKeyId}
              onChange={(e) => setDeleteKeyId(e.target.value)}
              placeholder="Enter API key ID"
            />
          </div>
          <button
            onClick={deleteKey}
            disabled={deleteLoading || !deleteKeyId}
            className={`px-4 py-2 rounded-md text-white font-medium ${deleteLoading || !deleteKeyId ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Key'}
          </button>
        </div>

        {apiKeys.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl font-semibold p-6" style={{ color: '#008080' }}>API Keys</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apiKeys.map((key) => (
                    <tr key={key.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{key.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{key.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                        <div className="truncate max-w-xs" title={key.keyValue}>
                          {key.keyValue}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${key.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {key.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(key.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{key.expiresAt ? new Date(key.expiresAt).toLocaleString() : 'Never'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => {
                            setToggleKeyId(key.id.toString());
                            toggleKeyStatus();
                          }}
                          className="mr-2 text-sm text-teal-600 hover:text-teal-900"
                        >
                          Toggle
                        </button>
                        <button
                          onClick={() => {
                            setDeleteKeyId(key.id.toString());
                            deleteKey();
                          }}
                          className="text-sm text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}