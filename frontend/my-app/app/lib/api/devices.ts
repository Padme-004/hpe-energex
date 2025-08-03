const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in environment variables');
}

export interface Device {
  deviceId: number;
  deviceName: string;
  deviceType: string;
  powerRating: string;
  location: string;
  houseId: number;
  userId: number;
  status?: string;
  powerUsage?: number;
  on?: boolean;
  turnedOnAt?: string;
}

export interface DevicePayload {
  deviceName: string;
  deviceType: string;
  powerRating: string;
  location: string;
  userId: number;
  houseId: number;
}

export interface DeviceResponse {
  deviceId: number;
  message?: string;
  [key: string]: any;
}

export interface DeviceStatusResponse {
  message: string;
  device?: Device;
}

export const DeviceService = {
  async addDevice(
    deviceData: Omit<DevicePayload, 'userId' | 'houseId'>,
    userInfo: { userId: number; houseId: number },
    token: string
  ): Promise<DeviceResponse> {
    const payload: DevicePayload = {
      ...deviceData,
      userId: userInfo.userId,
      houseId: userInfo.houseId,
    };

    const response = await fetch(`${API_BASE_URL}/api/devices`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add device');
    }

    return response.json();
  },

  async getDevicesByHouse(houseId: number, token: string): Promise<Device[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/devices?houseId=${houseId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.status === 401) {
      throw new Error('Unauthorized - Please login again');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch devices');
    }

    const data = await response.json();
    return (data.content || data).map((device: any) => ({
      ...device,
      status: device.on ? 'ON' : 'OFF',
      powerUsage: parseInt(device.powerRating?.replace('W', '') || '0', 10)
    }));
  },

  async getDeviceDetails(deviceId: number, token: string): Promise<Device> {
    const response = await fetch(
      `${API_BASE_URL}/api/devices/${deviceId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.status === 401) {
      throw new Error('Unauthorized - Please login again');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get device details');
    }

    return response.json();
  },

  async toggleDeviceStatus(deviceId: number, token: string): Promise<DeviceStatusResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/device-status/${deviceId}/toggle`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.status === 401) {
      throw new Error('Unauthorized - Please login again');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to toggle device status');
    }

    return response.json();
  },

  async updateDevice(
    deviceId: number,
    updateData: Partial<DevicePayload>, // Now includes houseId in payload
    token: string
  ): Promise<DeviceResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/devices/${deviceId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      }
    );

    if (response.status === 401) {
      throw new Error('Unauthorized - Please login again');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update device');
    }

    return response.json();
  },

  async deleteDevice(deviceId: number, token: string): Promise<{ message: string }> {
    const response = await fetch(
      `${API_BASE_URL}/api/devices/${deviceId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.status === 401) {
      throw new Error('Unauthorized - Please login again');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete device');
    }

    try {
      return await response.json();
    } catch {
      return { message: `Device ${deviceId} deleted successfully` };
    }
  },

  createDeviceEventSource(
    houseId: number,
    token: string,
    callbacks: {
      onInit?: (devices: Device[]) => void;
      onUpdate?: (device: Device | Device[]) => void;
      onError?: (error: Event) => void;
      onOpen?: () => void;
    }
  ): EventSource {
    const url = `${API_BASE_URL}/api/device-status/house/${houseId}/subscribe?token=${encodeURIComponent(token)}`;
    const eventSource = new EventSource(url);

    eventSource.addEventListener('INIT', (event) => {
      try {
        const deviceList = JSON.parse(event.data);
        if (Array.isArray(deviceList)) {
          const normalizedDevices = deviceList.map((device: any) => ({
            ...device,
            status: device.on ? 'ON' : 'OFF',
            powerUsage: parseInt(device.powerRating?.replace('W', '') || '0', 10)
          }));
          callbacks.onInit?.(normalizedDevices);
        }
      } catch (err) {
        console.error('Error parsing INIT event data:', err, event.data);
      }
    });

    eventSource.addEventListener('DEVICE_UPDATE', (event) => {
      try {
        const updatedData = JSON.parse(event.data);
        if (Array.isArray(updatedData)) {
          const normalizedDevices = updatedData.map((device: any) => ({
            ...device,
            status: device.on ? 'ON' : 'OFF',
            powerUsage: parseInt(device.powerRating?.replace('W', '') || '0', 10)
          }));
          callbacks.onUpdate?.(normalizedDevices);
        } else if (updatedData && updatedData.deviceId) {
          const normalizedDevice = {
            ...updatedData,
            status: updatedData.on ? 'ON' : 'OFF',
            powerUsage: parseInt(updatedData.powerRating?.replace('W', '') || '0', 10)
          };
          callbacks.onUpdate?.(normalizedDevice);
        }
      } catch (err) {
        console.error('Error parsing DEVICE_UPDATE event data:', err, event.data);
      }
    });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          const normalizedDevices = data.map((device: any) => ({
            ...device,
            status: device.on ? 'ON' : 'OFF',
            powerUsage: parseInt(device.powerRating?.replace('W', '') || '0', 10)
          }));
          callbacks.onUpdate?.(normalizedDevices);
        } else if (data && data.deviceId) {
          const normalizedDevice = {
            ...data,
            status: data.on ? 'ON' : 'OFF',
            powerUsage: parseInt(data.powerRating?.replace('W', '') || '0', 10)
          };
          callbacks.onUpdate?.(normalizedDevice);
        }
      } catch (err) {
        console.error('Error parsing generic SSE data:', err, event.data);
      }
    };

    eventSource.onopen = () => {
      callbacks.onOpen?.();
    };

    eventSource.onerror = (err) => {
      callbacks.onError?.(err);
    };

    return eventSource;
  }
};