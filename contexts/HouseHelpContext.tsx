import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getHouseHelps, addHouseHelp as dbAddHouseHelp, updateHouseHelp as dbUpdateHouseHelp, deleteHouseHelp as dbDeleteHouseHelp } from '@/utils/database';

export interface HouseHelp {
  id: string;
  name: string;
  monthlySalary: number;
  shifts: number;
  dailyWage: number;
}

interface HouseHelpContextType {
  houseHelps: HouseHelp[];
  addHouseHelp: (houseHelp: Omit<HouseHelp, 'id'>) => void;
  updateHouseHelp: (id: string, houseHelp: Partial<HouseHelp>) => void;
  deleteHouseHelp: (id: string) => void;
}

const HouseHelpContext = createContext<HouseHelpContextType | undefined>(undefined);

export const HouseHelpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [houseHelps, setHouseHelps] = useState<HouseHelp[]>([]);

  useEffect(() => {
    loadHouseHelps();
  }, []);

  const loadHouseHelps = async () => {
    try {
      console.log('Loading house helps...');
      const loadedHouseHelps = await getHouseHelps();
      console.log('Loaded house helps:', loadedHouseHelps);
      setHouseHelps(loadedHouseHelps);
    } catch (error) {
      console.error('Failed to load house helps:', error);
      setHouseHelps([]); // Set to empty array in case of error
    }
  };

  const addHouseHelp = async (houseHelp: Omit<HouseHelp, 'id'>) => {
    const newHouseHelp: HouseHelp = { 
      ...houseHelp, 
      id: Date.now().toString() // Generate a unique ID
    };
    try {
      await dbAddHouseHelp(newHouseHelp);
      setHouseHelps((prevHouseHelps) => [...prevHouseHelps, newHouseHelp]);
    } catch (error) {
      console.error('Failed to add house help:', error);
    }
  };

  const updateHouseHelp = async (id: string, updatedHouseHelp: Partial<HouseHelp>) => {
    try {
      await dbUpdateHouseHelp(id, updatedHouseHelp);
      setHouseHelps((prevHouseHelps) =>
        prevHouseHelps.map((houseHelp) =>
          houseHelp.id === id ? { ...houseHelp, ...updatedHouseHelp } : houseHelp
        )
      );
    } catch (error) {
      console.error('Failed to update house help:', error);
    }
  };

  const deleteHouseHelp = async (id: string) => {
    try {
      await dbDeleteHouseHelp(id);
      setHouseHelps((prevHouseHelps) => prevHouseHelps.filter((houseHelp) => houseHelp.id !== id));
    } catch (error) {
      console.error('Failed to delete house help:', error);
    }
  };

  return (
    <HouseHelpContext.Provider value={{ houseHelps, addHouseHelp, updateHouseHelp, deleteHouseHelp }}>
      {children}
    </HouseHelpContext.Provider>
  );
};

export const useHouseHelp = () => {
  const context = useContext(HouseHelpContext);
  if (context === undefined) {
    throw new Error('useHouseHelp must be used within a HouseHelpProvider');
  }
  return context;
};
