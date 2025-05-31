// app/lib/api/houses.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in environment variables');
}

export interface House {
  houseId: number;
  houseName: string;
  location: string;
}

export interface HousePayload {
  houseName: string;
  location: string;
}

export interface HouseResponse {
  houseId: number;
  message?: string;
  [key: string]: any;
}

export const HouseService = {
  async addHouse(
    houseData: HousePayload,
    token: string
  ): Promise<HouseResponse> {
    const response = await fetch(`${API_BASE_URL}/api/houses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(houseData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add home');
    }

    return response.json();
  },

  async deleteHouse(
    houseId: string,
    token: string
  ): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/houses/${houseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete home');
    }

    try {
      return await response.json();
    } catch {
      return { message: `Home ${houseId} deleted successfully` };
    }
  },

  async getHouses(token: string): Promise<House[]> {
    const response = await fetch(`${API_BASE_URL}/api/houses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      throw new Error('Unauthorized - Please login again');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch houses');
    }

    return response.json();
  },

  async getHouseDetails(houseId: string, token: string): Promise<House> {
    const response = await fetch(`${API_BASE_URL}/api/houses/${houseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      throw new Error('Unauthorized - Please login again');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch house details');
    }

    return response.json();
  },

  async updateHouse(
    houseId: number,
    updateData: Partial<HousePayload>,
    token: string
  ): Promise<HouseResponse> {
    const response = await fetch(`${API_BASE_URL}/api/houses/${houseId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (response.status === 401) {
      throw new Error('Unauthorized - Please login again');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update house');
    }

    return response.json();
  }
};