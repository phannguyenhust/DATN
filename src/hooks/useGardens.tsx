// import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { Garden } from '../types';

// interface GardenContextType {
//   gardens: Garden[];
//   addGarden: (garden: Garden) => void;
//   deviceId: string; // Add deviceId to context type
//   setDeviceId: (deviceId: string) => void;
// }

// const GardenContext = createContext<GardenContextType | undefined>(undefined);

// export const GardenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [gardens, setGardens] = useState<Garden[]>([]);
//   const [deviceId, setDeviceId] = useState<string>('');

//   const addGarden = (garden: Garden) => {
//     setGardens([...gardens, garden]);
//   };

//   const contextValue: GardenContextType = {
//     gardens,
//     addGarden,
//     deviceId,
//     setDeviceId,
//   };

//   return (
//     <GardenContext.Provider value={contextValue}>
//       {children}
//     </GardenContext.Provider>
//   );
// };

// export const useGardens = (): GardenContextType => {
//   const context = useContext(GardenContext);
//   if (!context) {
//     throw new Error('useGardens must be used within a GardenProvider');
//   }
//   return context;
// };
