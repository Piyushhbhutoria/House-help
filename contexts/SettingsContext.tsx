import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface Settings {
  // Notification settings
  notificationsEnabled: boolean;
  notificationTime: string;
  weeklyReminders: boolean;
  monthlyReports: boolean;

  // Currency settings
  currency: 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY';
  currencySymbol: string;

  // Theme settings
  themePreference: 'auto' | 'light' | 'dark';

  // Default configurations
  defaultWorkingDays: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday

  // App settings
  language: 'en' | 'hi';

  // Backup settings
  backupFrequency: 'daily' | 'weekly' | 'monthly' | 'never';

  // Other preferences
  showHelpTips: boolean;
  confirmDeletions: boolean;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
  notificationsEnabled: true,
  notificationTime: '09:00',
  weeklyReminders: true,
  monthlyReports: true,
  currency: 'INR',
  currencySymbol: '₹',
  themePreference: 'auto',
  defaultWorkingDays: [1, 2, 3, 4, 5], // Monday to Friday
  language: 'en',
  backupFrequency: 'weekly',
  showHelpTips: true,
  confirmDeletions: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // For now, use localStorage/AsyncStorage simulation
      // In a real app, this would use database operations
      const storedSettings = await getStoredSettings();
      if (storedSettings) {
        setSettings({ ...defaultSettings, ...storedSettings });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };

      // Update currency symbol when currency changes
      if (newSettings.currency) {
        updatedSettings.currencySymbol = getCurrencySymbol(newSettings.currency);
      }

      await saveSettings(updatedSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  const resetSettings = async () => {
    try {
      await saveSettings(defaultSettings);
      setSettings(defaultSettings);
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw error;
    }
  };

  const refreshSettings = async () => {
    await loadSettings();
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      loading,
      updateSettings,
      resetSettings,
      refreshSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Utility functions
const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
  };
  return symbols[currency] || '₹';
};

// Mock storage functions (would be replaced with database operations)
const getStoredSettings = async (): Promise<Partial<Settings> | null> => {
  try {
    // This would use actual database storage in a real implementation
    return null; // For now, return null to use defaults
  } catch (error) {
    console.error('Error loading stored settings:', error);
    return null;
  }
};

const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    // This would use actual database storage in a real implementation
    console.log('Settings saved:', settings);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};
