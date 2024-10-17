import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { HouseHelp } from './HouseHelpContext';
import { getAttendances, addAttendance as dbAddAttendance, updateAttendance as dbUpdateAttendance } from '@/utils/database';

interface Attendance {
  id: string;
  houseHelpId: string;
  date: string;
  status: 'present' | 'absent' | 'half-day';
  shiftsCompleted: number;
}

interface SalaryInfo {
  houseHelpId: string;
  totalDays: number;
  presentDays: number;
  halfDays: number;
  totalShifts: number;
  totalSalary: number;
}

interface AttendanceContextType {
  attendances: Attendance[];
  addAttendance: (attendance: Omit<Attendance, 'id'>) => void;
  updateAttendance: (id: string, attendance: Partial<Attendance>) => void;
  getAttendanceForDate: (date: string) => Attendance[];
  calculateSalary: (houseHelp: HouseHelp, startDate: string, endDate: string) => SalaryInfo;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  useEffect(() => {
    loadAttendances();
  }, []);

  const loadAttendances = async () => {
    try {
      const loadedAttendances = await getAttendances();
      setAttendances(loadedAttendances);
    } catch (error) {
      console.error('Failed to load attendances:', error);
      setAttendances([]); // Set to empty array in case of error
    }
  };

  const addAttendance = async (attendance: Omit<Attendance, 'id'>) => {
    const newAttendance = { ...attendance, id: Date.now().toString() };
    try {
      await dbAddAttendance(newAttendance);
      setAttendances((prevAttendances) => [...prevAttendances, newAttendance]);
    } catch (error) {
      console.error('Failed to add attendance:', error);
    }
  };

  const updateAttendance = async (id: string, updatedAttendance: Partial<Attendance>) => {
    try {
      await dbUpdateAttendance(id, updatedAttendance);
      setAttendances((prevAttendances) =>
        prevAttendances.map((attendance) =>
          attendance.id === id ? { ...attendance, ...updatedAttendance } : attendance
        )
      );
    } catch (error) {
      console.error('Failed to update attendance:', error);
    }
  };

  const getAttendanceForDate = (date: string) => {
    return attendances.filter((attendance) => attendance.date === date);
  };

  const calculateSalary = (houseHelp: HouseHelp, startDate: string, endDate: string): SalaryInfo => {
    const relevantAttendances = attendances.filter(
      (a) => a.houseHelpId === houseHelp.id && a.date >= startDate && a.date <= endDate
    );

    const totalDays = relevantAttendances.length;
    const presentDays = relevantAttendances.filter((a) => a.status === 'present').length;
    const halfDays = relevantAttendances.filter((a) => a.status === 'half-day').length;
    const totalShifts = relevantAttendances.reduce((sum, a) => sum + a.shiftsCompleted, 0);

    const dailyWage = houseHelp.monthlySalary / 30; // Assuming 30 days in a month
    const totalSalary = (presentDays * dailyWage) + (halfDays * dailyWage * 0.5);

    return {
      houseHelpId: houseHelp.id,
      totalDays,
      presentDays,
      halfDays,
      totalShifts,
      totalSalary,
    };
  };

  return (
    <AttendanceContext.Provider value={{ attendances, addAttendance, updateAttendance, getAttendanceForDate, calculateSalary }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
