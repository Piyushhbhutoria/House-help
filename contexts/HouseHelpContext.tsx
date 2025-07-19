import { addHouseHelp as dbAddHouseHelp, deleteHouseHelp as dbDeleteHouseHelp, updateHouseHelp as dbUpdateHouseHelp, getHouseHelps } from '@/utils/database';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface HouseHelp {
  id: string;
  name: string;
  monthlySalary: number;
  shifts: number;
  dailyWage: number;
  overtimeRate: number;
  holidayRate: number;
  advancePayment: number;
  adjustments: number;
  multipleShifts: boolean;
  shiftTimes?: { start: string; end: string }[];
  workingDays: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
}

interface HouseHelpContextType {
  houseHelps: HouseHelp[];
  loading: boolean;
  addHouseHelp: (houseHelp: Omit<HouseHelp, 'id'>) => Promise<void>;
  updateHouseHelp: (id: string, updatedHouseHelp: Partial<HouseHelp>) => Promise<void>;
  deleteHouseHelp: (id: string) => Promise<void>;
  refreshHouseHelps: () => Promise<void>;
}

const HouseHelpContext = createContext<HouseHelpContextType | undefined>(undefined);

export const HouseHelpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [houseHelps, setHouseHelps] = useState<HouseHelp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHouseHelps();
  }, []);

  const loadHouseHelps = async () => {
    try {
      setLoading(true);
      console.log('Loading house helps...');
      const loadedHouseHelps = await getHouseHelps();
      console.log('Loaded house helps:', loadedHouseHelps);
      setHouseHelps(loadedHouseHelps);
    } catch (error) {
      console.error('Failed to load house helps:', error);
      setHouseHelps([]); // Set to empty array in case of error
    } finally {
      setLoading(false);
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
      throw error;
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
      throw error;
    }
  };

  const deleteHouseHelp = async (id: string) => {
    try {
      await dbDeleteHouseHelp(id);
      setHouseHelps((prevHouseHelps) => prevHouseHelps.filter((houseHelp) => houseHelp.id !== id));
    } catch (error) {
      console.error('Failed to delete house help:', error);
      throw error;
    }
  };

  const refreshHouseHelps = async () => {
    await loadHouseHelps();
  };

  return (
    <HouseHelpContext.Provider value={{
      houseHelps,
      loading,
      addHouseHelp,
      updateHouseHelp,
      deleteHouseHelp,
      refreshHouseHelps
    }}>
      {children}
    </HouseHelpContext.Provider>
  );
};

export const useHouseHelp = () => {
  const context = useContext(HouseHelpContext);
  if (!context) {
    throw new Error('useHouseHelp must be used within a HouseHelpProvider');
  }
  return context;
};
