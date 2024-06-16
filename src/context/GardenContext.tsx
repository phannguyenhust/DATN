import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Garden, GardenContextType } from '../types';


const GardenContext = createContext<GardenContextType | undefined>(undefined);

export const GardenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [deviceId, setDeviceId] = useState<string>(''); // Khởi tạo deviceId và hàm set

  const addGarden = (garden: Garden) => {
    setGardens([...gardens, garden]);
  };

  // Define the setGardens function
  const contextValue: GardenContextType = {
    gardens,
    addGarden,
    setGardens, // Include setGardens in the context value
    deviceId, // Đưa deviceId vào context value
    setDeviceId, // Đưa hàm setDeviceId vào context value
  };

  return (
    <GardenContext.Provider value={contextValue}>
      {children}
    </GardenContext.Provider>
  );
};

export const useGardens = (): GardenContextType => {
  const context = useContext(GardenContext);
  if (!context) {
    throw new Error('useGardens must be used within a GardenProvider');
  }
  return context;
};
