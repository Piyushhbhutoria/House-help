import { Attendance } from '@/contexts/AttendanceContext';
import { HouseHelp } from '@/contexts/HouseHelpContext';
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<void> => {
  if (db === null) {
    db = await SQLite.openDatabaseAsync('househelp.db');
    console.log('Database initialized successfully');
  }

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS househelps (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      monthlySalary REAL NOT NULL,
      shifts INTEGER NOT NULL,
      dailyWage REAL NOT NULL
    );
  `);

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

  console.log('Tables created successfully');
};

export const getHouseHelps = async (): Promise<HouseHelp[]> => {
  if (!db) await initDatabase();
  try {
    const result = await db!.execAsync(`SELECT * FROM househelps`);
    console.log('Raw result from getHouseHelps:', JSON.stringify(result));
    if (result && Array.isArray(result) && result.length > 0) {
      if (result[0].rows && Array.isArray(result[0].rows)) {
        console.log('Parsed house helps:', result[0].rows);
        return result[0].rows as HouseHelp[];
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
    const query = await db!.prepareAsync(
      `INSERT INTO househelps (id, name, monthlySalary, shifts, dailyWage) VALUES (?, ?, ?, ?, ?)`
    );
    await query.executeAsync([houseHelp.id, houseHelp.name, houseHelp.monthlySalary, houseHelp.shifts, houseHelp.dailyWage]);
    console.log('House help added successfully');
  } catch (error) {
    console.error('Error adding house help:', error);
    throw error;
  }
};

export const updateHouseHelp = async (id: string, houseHelp: Partial<HouseHelp>): Promise<void> => {
  if (!db) await initDatabase();
  try {
    const query = await db!.prepareAsync(
      `UPDATE househelps SET name = ?, monthlySalary = ?, shifts = ?, dailyWage = ? WHERE id = ?`
    );
    await query.executeAsync([houseHelp.name, houseHelp.monthlySalary, houseHelp.shifts, houseHelp.dailyWage, id]);
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
    await query.executeAsync([attendance.status, attendance.shiftsCompleted, id]);
  } catch (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }
};
