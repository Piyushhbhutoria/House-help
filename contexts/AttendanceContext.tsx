import { addAttendance as dbAddAttendance, updateAttendance as dbUpdateAttendance, getAttendances } from '@/utils/database';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { HouseHelp } from './HouseHelpContext';

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

    // Calculate total working days in the date range based on house help's working days
    const start = new Date(startDate);
    const end = new Date(endDate);
    let totalWorkingDays = 0;

    // If no working days specified (backward compatibility), count all days
    const workingDays = houseHelp.workingDays && houseHelp.workingDays.length > 0
      ? houseHelp.workingDays
      : [0, 1, 2, 3, 4, 5, 6]; // All days if not specified

    // Count actual working days in the date range
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (workingDays.includes(dayOfWeek)) {
        totalWorkingDays++;
      }
    }

    const totalDays = relevantAttendances.length;
    const presentDays = relevantAttendances.filter((a) => a.status === 'present').length;
    const halfDays = relevantAttendances.filter((a) => a.status === 'half-day').length;
    const totalShifts = relevantAttendances.reduce((sum, a) => sum + a.shiftsCompleted, 0);

    // Calculate salary based on shifts completed rather than just present/half days
    const shiftWage = houseHelp.dailyWage / houseHelp.shifts; // Wage per shift
    const totalSalary = totalShifts * shiftWage;

    return {
      houseHelpId: houseHelp.id,
      totalDays: totalWorkingDays, // Use working days instead of attendance days
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
