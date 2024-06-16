import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Farm {
  idFarm: number;
  nameFarm: string;
  addressFarm: string;
}

interface FarmContextData {
  farms: Farm[];
  addFarm: (farm: Farm) => void;
}

const FarmContext = createContext<FarmContextData | undefined>(undefined);

export const useFarms = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarms must be used within a FarmProvider');
  }
  return context;
};

export const FarmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [farms, setFarms] = useState<Farm[]>([]);

  const addFarm = (farm: Farm) => {
    setFarms((prevFarms) => [...prevFarms, farm]);
  };

  return (
    <FarmContext.Provider value={{ farms, addFarm }}>
      {children}
    </FarmContext.Provider>
  );
};
