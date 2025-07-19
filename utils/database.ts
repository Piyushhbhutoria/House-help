import { HouseHelp } from '@/contexts/HouseHelpContext';
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Define Attendance interface locally to avoid circular imports
interface Attendance {
  id: string;
  houseHelpId: string;
  date: string;
  status: 'present' | 'absent' | 'half-day';
  shiftsCompleted: number;
}

// Define Payment interface locally to avoid circular imports
interface Payment {
  id: string;
  houseHelpId: string;
  amount: number;
  type: 'advance' | 'holiday' | 'overtime' | 'adjustment' | 'salary';
  date: string;
  description: string;
}

let db: SQLite.SQLiteDatabase | MockDatabase | null = null;

// Mock database implementation for web platform
class MockDatabase {
  async execAsync(query: string): Promise<any[]> {
    console.warn('Database operations are not supported on web platform');
    return [{ rows: [] }];
  }

  async prepareAsync(query: string) {
    console.warn('Database operations are not supported on web platform');
    return {
      executeAsync: async () => [],
    };
  }
}

export const initDatabase = async (): Promise<void> => {
  if (db === null) {
    if (Platform.OS === 'web') {
      db = new MockDatabase();
      console.log('Mock database initialized for web platform');
    } else {
      db = await SQLite.openDatabaseAsync('househelp.db');
      console.log('Database initialized successfully');

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS househelps (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          monthlySalary REAL NOT NULL,
          shifts INTEGER NOT NULL,
          dailyWage REAL NOT NULL,
          workingDays TEXT DEFAULT '1,2,3,4,5',
          overtimeRate REAL DEFAULT 0,
          holidayRate REAL DEFAULT 0,
          advancePayment REAL DEFAULT 0,
          adjustments REAL DEFAULT 0,
          multipleShifts INTEGER DEFAULT 0
        );
      `);

      // Check if workingDays column exists, if not add it for backward compatibility
      try {
        await db.execAsync(`ALTER TABLE househelps ADD COLUMN workingDays TEXT DEFAULT '1,2,3,4,5'`);
        console.log('Added workingDays column for backward compatibility');
      } catch (error) {
        // Column already exists, ignore the error
        console.log('workingDays column already exists');
      }

      // Add other missing columns for backward compatibility
      const columnsToAdd = [
        'overtimeRate REAL DEFAULT 0',
        'holidayRate REAL DEFAULT 0',
        'advancePayment REAL DEFAULT 0',
        'adjustments REAL DEFAULT 0',
        'multipleShifts INTEGER DEFAULT 0'
      ];

      for (const column of columnsToAdd) {
        try {
          await db.execAsync(`ALTER TABLE househelps ADD COLUMN ${column}`);
          console.log(`Added ${column} column for backward compatibility`);
        } catch (error) {
          // Column already exists, ignore the error
          console.log(`${column} column already exists or error adding it:`, error);
        }
      }

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS attendances (
          id TEXT PRIMARY KEY NOT NULL,
          houseHelpId TEXT NOT NULL,
          date TEXT NOT NULL,
          status TEXT NOT NULL,
          shiftsCompleted INTEGER NOT NULL,
          FOREIGN KEY (houseHelpId) REFERENCES househelps (id)
        );
      `);

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS payments (
          id TEXT PRIMARY KEY NOT NULL,
          houseHelpId TEXT NOT NULL,
          amount REAL NOT NULL,
          type TEXT NOT NULL,
          date TEXT NOT NULL,
          description TEXT DEFAULT '',
          FOREIGN KEY (houseHelpId) REFERENCES househelps (id)
        );
      `);

      console.log('Tables created successfully');
    }
  }
};

export const getHouseHelps = async (): Promise<HouseHelp[]> => {
  if (!db) await initDatabase();
  try {
    const result = await db!.execAsync(`SELECT * FROM househelps`);
    console.log('Raw result from getHouseHelps:', JSON.stringify(result));
    if (result && Array.isArray(result) && result.length > 0) {
      if (result[0].rows && Array.isArray(result[0].rows)) {
        // Parse workingDays from string to array
        const houseHelps = result[0].rows.map((row: any) => ({
          ...row,
          workingDays: row.workingDays ? row.workingDays.split(',').map(Number) : [1, 2, 3, 4, 5],
          multipleShifts: Boolean(row.multipleShifts),
          shiftTimes: row.shiftTimes ? JSON.parse(row.shiftTimes) : undefined,
        }));
        console.log('Parsed house helps:', houseHelps);
        return houseHelps as HouseHelp[];
      } else {
        console.warn('Unexpected rows structure:', result[0]);
        return [];
      }
    } else {
      console.warn('Unexpected result structure:', result);
      return [];
    }
  } catch (error) {
    console.error('Error fetching house helps:', error);
    return [];
  }
};

export const addHouseHelp = async (houseHelp: HouseHelp): Promise<void> => {
  if (!db) await initDatabase();
  try {
    console.log('Attempting to add house help:', houseHelp);
    const workingDaysString = houseHelp.workingDays ? houseHelp.workingDays.join(',') : '1,2,3,4,5';
    const shiftTimesString = houseHelp.shiftTimes ? JSON.stringify(houseHelp.shiftTimes) : null;

    const query = await db!.prepareAsync(
      `INSERT INTO househelps (id, name, monthlySalary, shifts, dailyWage, workingDays, overtimeRate, holidayRate, advancePayment, adjustments, multipleShifts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    await query.executeAsync([
      houseHelp.id,
      houseHelp.name,
      houseHelp.monthlySalary,
      houseHelp.shifts,
      houseHelp.dailyWage,
      workingDaysString,
      houseHelp.overtimeRate || 0,
      houseHelp.holidayRate || 0,
      houseHelp.advancePayment || 0,
      houseHelp.adjustments || 0,
      houseHelp.multipleShifts ? 1 : 0
    ]);
    console.log('House help added successfully');
  } catch (error) {
    console.error('Error adding house help:', error);
    throw error;
  }
};

export const updateHouseHelp = async (id: string, houseHelp: Partial<HouseHelp>): Promise<void> => {
  if (!db) await initDatabase();
  try {
    const workingDaysString = houseHelp.workingDays ? houseHelp.workingDays.join(',') : '1,2,3,4,5';

    const query = await db!.prepareAsync(
      `UPDATE househelps SET name = ?, monthlySalary = ?, shifts = ?, dailyWage = ?, workingDays = ?, overtimeRate = ?, holidayRate = ?, advancePayment = ?, adjustments = ?, multipleShifts = ? WHERE id = ?`
    );
    await query.executeAsync([
      houseHelp.name || '',
      houseHelp.monthlySalary || 0,
      houseHelp.shifts || 1,
      houseHelp.dailyWage || 0,
      workingDaysString,
      houseHelp.overtimeRate || 0,
      houseHelp.holidayRate || 0,
      houseHelp.advancePayment || 0,
      houseHelp.adjustments || 0,
      houseHelp.multipleShifts ? 1 : 0,
      id
    ]);
  } catch (error) {
    console.error('Error updating house help:', error);
    throw error;
  }
};

export const deleteHouseHelp = async (id: string): Promise<void> => {
  if (!db) await initDatabase();
  try {
    const query = await db!.prepareAsync(`DELETE FROM househelps WHERE id = ?`);
    await query.executeAsync([id]);
  } catch (error) {
    console.error('Error deleting house help:', error);
    throw error;
  }
};

export const getAttendances = async (): Promise<Attendance[]> => {
  if (!db) await initDatabase();
  try {
    const result = await db!.execAsync(`SELECT * FROM attendances`);
    if (Array.isArray(result) && result.length > 0 && result[0].rows) {
      return result[0].rows as Attendance[];
    } else {
      console.warn('No attendances found or unexpected result structure');
      return [];
    }
  } catch (error) {
    console.error('Error fetching attendances:', error);
    return [];
  }
};

export const addAttendance = async (attendance: Attendance): Promise<void> => {
  if (!db) await initDatabase();
  try {
    const query = await db!.prepareAsync(
      `INSERT INTO attendances (id, houseHelpId, date, status, shiftsCompleted) VALUES (?, ?, ?, ?, ?)`
    );
    await query.executeAsync([attendance.id, attendance.houseHelpId, attendance.date, attendance.status, attendance.shiftsCompleted]);
  } catch (error) {
    console.error('Error adding attendance:', error);
    throw error;
  }
};

export const updateAttendance = async (id: string, attendance: Partial<Attendance>): Promise<void> => {
  if (!db) await initDatabase();
  try {
    const query = await db!.prepareAsync(
      `UPDATE attendances SET status = ?, shiftsCompleted = ? WHERE id = ?`
    );
    await query.executeAsync([
      attendance.status || 'absent',
      attendance.shiftsCompleted || 0,
      id
    ]);
  } catch (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }
};

// Payment database operations
export const getPayments = async (): Promise<Payment[]> => {
  if (!db) await initDatabase();
  try {
    const result = await db!.execAsync(`SELECT * FROM payments ORDER BY date DESC`);
    if (Array.isArray(result) && result.length > 0 && result[0].rows) {
      return result[0].rows as Payment[];
    } else {
      console.warn('No payments found or unexpected result structure');
      return [];
    }
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
};

export const addPayment = async (payment: Payment): Promise<void> => {
  if (!db) await initDatabase();
  try {
    const query = await db!.prepareAsync(
      `INSERT INTO payments (id, houseHelpId, amount, type, date, description) VALUES (?, ?, ?, ?, ?, ?)`
    );
    await query.executeAsync([
      payment.id,
      payment.houseHelpId,
      payment.amount,
      payment.type,
      payment.date,
      payment.description || ''
    ]);
    console.log('Payment added successfully');
  } catch (error) {
    console.error('Error adding payment:', error);
    throw error;
  }
};

export const updatePayment = async (id: string, payment: Partial<Payment>): Promise<void> => {
  if (!db) await initDatabase();
  try {
    const query = await db!.prepareAsync(
      `UPDATE payments SET amount = ?, type = ?, date = ?, description = ? WHERE id = ?`
    );
    await query.executeAsync([
      payment.amount || 0,
      payment.type || 'adjustment',
      payment.date || new Date().toISOString().split('T')[0],
      payment.description || '',
      id
    ]);
    console.log('Payment updated successfully');
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
};

export const deletePayment = async (id: string): Promise<void> => {
  if (!db) await initDatabase();
  try {
    const query = await db!.prepareAsync(`DELETE FROM payments WHERE id = ?`);
    await query.executeAsync([id]);
    console.log('Payment deleted successfully');
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
};
