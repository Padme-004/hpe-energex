'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { ApiKey, ApiKeyService } from '../../lib/api/apiKey';

interface DecodedToken {
  role: string;
  userId: number;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

type TabType = 'view' | 'add' | 'toggle' | 'delete';

export default function ManageKeys() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('view');
  const [allApiKeys, setAllApiKeys] = useState<ApiKey[]>([]);
  const [displayedApiKeys, setDisplayedApiKeys] = useState<ApiKey[]>([]);
  const [newKey, setNewKey] = useState<ApiKey | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Pagination state
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0
  });

  // Loading states
  const [loading, setLoading] = useState({
    create: false,
    fetch: false,
    toggle: false,
    get: false,
    delete: false
  });

  // Form and input states
  const [keyForm, setKeyForm] = useState({
    name: '',
    description: '',
    expiresAt: '',
    active: true
  });

  const [inputValues, setInputValues] = useState({
    toggleKeyId: '',
    getKeyId: '',
    deleteKeyId: ''
  });

  const tabs = [
    { id: 'view', label: 'View Keys' },
    { id: 'add', label: 'Add Key'},
    { id: 'toggle', label: 'Toggle Status'},
    { id: 'delete', label: 'Delete Key'}
  ];

  useEffect(() => {
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setIsAdmin(decoded.role === 'ROLE_ADMIN');
        if (decoded.role === 'ROLE_ADMIN') {
          fetchAllKeys();
        }
      } catch (err) {
        console.error('Token decoding failed:', err);
      }
    }
  }, [token]);

  useEffect(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const paginatedKeys = allApiKeys.slice(startIndex, startIndex + pagination.pageSize);
    setDisplayedApiKeys(paginatedKeys);
    setPagination(prev => ({
      ...prev,
      total: allApiKeys.length
    }));
  }, [allApiKeys, pagination.page, pagination.pageSize]);

  const clearMessage = () => {
    setTimeout(() => setMessage(''), 5000);
  };

  const showMessage = (msg: string, type: 'success' | 'error' | 'info') => {
    setMessage(msg);
    setMessageType(type);
    clearMessage();
  };

  const handleInputChange = (field: keyof typeof inputValues, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateKey = async () => {
    if (!keyForm.name) {
      showMessage('Name is required', 'error');
      return;
    }

    setLoading(prev => ({...prev, create: true}));
    try {
      const createdKey = await ApiKeyService.createApiKey(token!, {
        name: keyForm.name,
        description: keyForm.description,
        expiresAt: keyForm.expiresAt,
        active: keyForm.active
      });
      
      setNewKey(createdKey);
      showMessage('API key created successfully!', 'success');
      setKeyForm({
        name: '',
        description: '',
        expiresAt: '',
        active: true
      });
      fetchAllKeys();
    } catch (error: any) {
      showMessage(error.message || 'Error creating API key', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(prev => ({...prev, create: false}));
    }
  };

  const fetchAllKeys = async () => {
    setLoading(prev => ({...prev, fetch: true}));
    try {
      const keys = await ApiKeyService.getAllApiKeys(token!);
      setAllApiKeys(keys);
      showMessage(`Loaded ${keys.length} API keys`, 'success');
    } catch (error: any) {
      showMessage(error.message || 'Error fetching API keys', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(prev => ({...prev, fetch: false}));
    }
  };

  const toggleKeyStatus = async (keyId?: string) => {
    const idToToggle = keyId || inputValues.toggleKeyId;
    if (!idToToggle) {
      showMessage('Please enter an API key ID', 'error');
      return;
    }

    setLoading(prev => ({...prev, toggle: true}));
    try {
      await ApiKeyService.toggleApiKeyStatus(token!, idToToggle);
      showMessage('API key status toggled successfully!', 'success');
      fetchAllKeys();
      setInputValues(prev => ({...prev, toggleKeyId: ''}));
    } catch (error: any) {
      showMessage(error.message || 'Error toggling API key status', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(prev => ({...prev, toggle: false}));
    }
  };

  const getKeyById = async () => {
    if (!inputValues.getKeyId) {
      showMessage('Please enter an API key ID', 'error');
      return;
    }

    setLoading(prev => ({...prev, get: true}));
    try {
      const key = await ApiKeyService.getApiKeyById(token!, inputValues.getKeyId);
      setAllApiKeys([key]);
      setPagination(prev => ({...prev, page: 1}));
      showMessage('API key retrieved successfully', 'success');
      setInputValues(prev => ({...prev, getKeyId: ''}));
    } catch (error: any) {
      showMessage(error.message || 'Error fetching API key', 'error');
      setAllApiKeys([]);
      console.error('Error:', error);
    } finally {
      setLoading(prev => ({...prev, get: false}));
    }
  };

  const deleteKey = async (keyId?: string) => {
    const idToDelete = keyId || inputValues.deleteKeyId;
    if (!idToDelete) {
      showMessage('Please enter an API key ID', 'error');
      return;
    }

    setLoading(prev => ({...prev, delete: true}));
    try {
      await ApiKeyService.deleteApiKey(token!, idToDelete);
      showMessage('API key deleted successfully!', 'success');
      fetchAllKeys();
      setInputValues(prev => ({...prev, deleteKeyId: ''}));
    } catch (error: any) {
      if (error.message && (error.message.includes('Unexpected end of JSON input') || error.message.includes('Failed to execute \'json\' on \'Response\''))) {
        showMessage('API key deleted successfully!', 'success');
        fetchAllKeys();
        setInputValues(prev => ({...prev, deleteKeyId: ''}));
      } else {
        showMessage(error.message || 'Error deleting API key', 'error');
        console.error('Delete error:', error);
      }
    } finally {
      setLoading(prev => ({...prev, delete: false}));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(pagination.total / pagination.pageSize)) {
      setPagination(prev => ({...prev, page: newPage}));
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize: newPageSize,
      page: 1
    }));
  };

  const renderPaginationControls = () => {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const startItem = (pagination.page - 1) * pagination.pageSize + 1;
    const endItem = Math.min(pagination.page * pagination.pageSize, pagination.total);

    return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-gray-50 border-t">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing {startItem}-{endItem} of {pagination.total} keys
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Show:</label>
            <select
              value={pagination.pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={pagination.page === 1}
            className={`px-3 py-1 rounded text-sm ${pagination.page === 1 ? 'bg-gray-200 text-gray-500' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`px-3 py-1 rounded text-sm ${pagination.page === 1 ? 'bg-gray-200 text-gray-500' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded text-sm ${
                    pagination.page === pageNum 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= totalPages}
            className={`px-3 py-1 rounded text-sm ${pagination.page >= totalPages ? 'bg-gray-200 text-gray-500' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={pagination.page >= totalPages}
            className={`px-3 py-1 rounded text-sm ${pagination.page >= totalPages ? 'bg-gray-200 text-gray-500' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
          >
            Last
          </button>
        </div>
      </div>
    );
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800" style={{ color: '#008080' }}>
          API Key Management
        </h1>
        
        {message && (
          <div className={`p-4 mb-6 rounded-md ${
            messageType === 'success' ? 'bg-green-100 text-green-800' : 
            messageType === 'error' ? 'bg-red-100 text-red-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
            
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* View Keys Tab */}
            {activeTab === 'view' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <h2 className="text-xl font-semibold" style={{ color: '#008080' }}>
                    API Keys Overview
                  </h2>
                  <div className="flex flex-col md:flex-row gap-4">
                    <button
                      onClick={fetchAllKeys}
                      disabled={loading.fetch}
                      className={`px-4 py-2 rounded-md text-white font-medium ${
                        loading.fetch ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'
                      }`}
                    >
                      {loading.fetch ? 'Loading...' : 'Refresh All Keys'}
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="text-black w-full md:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={inputValues.getKeyId}
                        onChange={(e) => handleInputChange('getKeyId', e.target.value)}
                        placeholder="Search by Key ID"
                      />
                      <button
                        onClick={getKeyById}
                        disabled={loading.get || !inputValues.getKeyId}
                        className={`px-4 py-2 rounded-md text-white font-medium ${
                          loading.get || !inputValues.getKeyId ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'
                        }`}
                      >
                        {loading.get ? 'Searching...' : 'Search'}
                      </button>
                    </div>
                  </div>
                </div>

                {allApiKeys.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {displayedApiKeys.map((key) => (
                            <tr key={key.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{key.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{key.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                <div className="truncate max-w-xs" title={key.keyValue}>
                                  {key.keyValue}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  key.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {key.active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(key.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : 'Never'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => toggleKeyStatus(key.id.toString())}
                                    className="text-teal-600 hover:text-teal-900 font-medium"
                                    disabled={loading.toggle}
                                  >
                                    Toggle
                                  </button>
                                  <button
                                    onClick={() => deleteKey(key.id.toString())}
                                    className="text-red-600 hover:text-red-900 font-medium"
                                    disabled={loading.delete}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {allApiKeys.length > pagination.pageSize && renderPaginationControls()}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>No API keys found. Create your first key using the "Add Key" tab.</p>
                  </div>
                )}
              </div>
            )}

            {/* Add Key Tab */}
            {activeTab === 'add' && (
              <div>
                <h2 className="text-xl font-semibold mb-6" style={{ color: '#008080' }}>
                  Create New API Key
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="keyName" className="block text-gray-700 font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="keyName"
                      className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={keyForm.name}
                      onChange={(e) => setKeyForm({...keyForm, name: e.target.value})}
                      placeholder="e.g., Production API Key"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="keyDescription" className="block text-gray-700 font-medium mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      id="keyDescription"
                      className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={keyForm.description}
                      onChange={(e) => setKeyForm({...keyForm, description: e.target.value})}
                      placeholder="e.g., For mobile app integration"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="keyExpiry" className="block text-gray-700 font-medium mb-2">
                      Expiration Date
                    </label>
                    <input
                      type="datetime-local"
                      id="keyExpiry"
                      className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  disabled={loading.create || !keyForm.name}
                  className={`px-6 py-3 rounded-md text-white font-medium ${
                    loading.create || !keyForm.name ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                >
                  {loading.create ? 'Creating...' : 'Generate API Key'}
                </button>
                
                {newKey && (
                  <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">✅ API Key Created Successfully!</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-green-700 font-medium mb-1">Key Name</label>
                          <div className="p-3 bg-white rounded-md text-gray-900 border">{newKey.name}</div>
                        </div>
                        
                        <div>
                          <label className="block text-green-700 font-medium mb-1">Status</label>
                          <div className="p-3 bg-white rounded-md border">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              newKey.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {newKey.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-green-700 font-medium mb-1">API Key Value</label>
                        <div className="p-4 bg-white rounded-md font-mono break-all text-gray-900 border">
                          {newKey.keyValue}
                        </div>
                        <p className="mt-2 text-sm text-red-600 font-medium">
                          ⚠️ Important: Copy this key now. It won't be shown again for security reasons.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Toggle Status Tab */}
            {activeTab === 'toggle' && (
              <div>
                <h2 className="text-xl font-semibold mb-6" style={{ color: '#008080' }}>
                  Toggle API Key Status
                </h2>
                <p className="text-gray-600 mb-6">
                  Enable or disable an API key by entering its ID. This will toggle between active and inactive states.
                </p>
                
                <div className="flex flex-col md:flex-row md:items-end gap-4 max-w-md">
                  <div className="flex-1">
                    <label htmlFor="toggleKeyId" className="block text-gray-700 font-medium mb-2">
                      API Key ID
                    </label>
                    <input
                      type="text"
                      id="toggleKeyId"
                      className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={inputValues.toggleKeyId}
                      onChange={(e) => handleInputChange('toggleKeyId', e.target.value)}
                      placeholder="Enter API key ID"
                    />
                  </div>
                  <button
                    onClick={() => toggleKeyStatus()}
                    disabled={loading.toggle || !inputValues.toggleKeyId}
                    className={`px-6 py-3 rounded-md text-white font-medium ${
                      loading.toggle || !inputValues.toggleKeyId ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'
                    }`}
                  >
                    {loading.toggle ? 'Processing...' : 'Toggle Status'}
                  </button>
                </div>
              </div>
            )}

            {/* Delete Key Tab */}
            {activeTab === 'delete' && (
              <div>
                <h2 className="text-xl font-semibold mb-6" style={{ color: '#008080' }}>
                  Delete API Key
                </h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 font-medium">⚠️ Warning</p>
                  <p className="text-red-700 text-sm mt-1">
                    This action cannot be undone. The API key will be permanently deleted and any applications using it will lose access.
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-end gap-4 max-w-md">
                  <div className="flex-1">
                    <label htmlFor="deleteKeyId" className="block text-gray-700 font-medium mb-2">
                      API Key ID
                    </label>
                    <input
                      type="text"
                      id="deleteKeyId"
                      className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={inputValues.deleteKeyId}
                      onChange={(e) => handleInputChange('deleteKeyId', e.target.value)}
                      placeholder="Enter API key ID"
                    />
                  </div>
                  <button
                    onClick={() => deleteKey()}
                    disabled={loading.delete || !inputValues.deleteKeyId}
                    className={`px-6 py-3 rounded-md text-white font-medium ${
                      loading.delete || !inputValues.deleteKeyId ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {loading.delete ? 'Deleting...' : 'Delete Key'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}