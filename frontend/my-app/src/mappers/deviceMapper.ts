// mappers/deviceMapper.ts

// Define the shape of your device form input
export interface DeviceForm {
    deviceName: string;
    deviceType: string;
    powerRating: string;
    location: string;
  }
  
  // Define the shape of the payload sent to the backend
  export interface DevicePayload extends DeviceForm {
    userId: number;
    houseId: number;
  }
  
 
  export const mapToDevicePayload = (
    form: DeviceForm,
    userId: number,
    houseId: number
  ): DevicePayload => ({
    ...form,
    userId,
    houseId
  });
  