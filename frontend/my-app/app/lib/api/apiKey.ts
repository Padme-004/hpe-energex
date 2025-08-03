const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in environment variables');
}

export interface ApiKey {
  id: number;
  keyValue: string;
  name: string;
  description: string;
  createdAt: string;
  expiresAt: string;
  active: boolean;
}

interface ApiKeyResponse {
  message?: string;
  [key: string]: any;
}

export const ApiKeyService = {
  async createApiKey(
    token: string,
    data: {
      name: string;
      description: string;
      expiresAt: string;
      active: boolean;
    }
  ): Promise<ApiKey> {
    const response = await fetch(`${API_BASE_URL}/api/admin/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        expiresAt: data.expiresAt || null,
        active: data.active
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create API key');
    }

    return response.json();
  },

  async getAllApiKeys(token: string): Promise<ApiKey[]> {
    const response = await fetch(`${API_BASE_URL}/api/admin/api-keys`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch API keys');
    }

    return response.json();
  },

  async toggleApiKeyStatus(token: string, keyId: string): Promise<ApiKeyResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/api-keys/${keyId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to toggle API key status');
    }

    return response.json();
  },

  async getApiKeyById(token: string, keyId: string): Promise<ApiKey> {
    const response = await fetch(`${API_BASE_URL}/api/admin/api-keys/${keyId}/details`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch API key');
    }

    return response.json();
  },

  async deleteApiKey(token: string, keyId: string): Promise<ApiKeyResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/api-keys/${keyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete API key');
    }

    return response.json();
  }
};