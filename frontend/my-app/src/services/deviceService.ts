// src/services/deviceService.ts

interface DevicePayload {
    deviceName: string;
    deviceType: string;
    powerRating: string;
    location: string;
    userId: number;
    houseId: number;
  }
  
  export const DeviceService = {
    async createDevice(
      deviceData: Omit<DevicePayload, 'userId' | 'houseId'>,
      userId: number,
      houseId: number,
      token: string
    ): Promise<{ deviceId: number }> {
      const payload: DevicePayload = {
        ...deviceData,
        userId,
        houseId,
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add device');
      }
  
      return response.json();
    },
  };