import { useSettings } from '@/contexts/SettingsContext';
import { getTheme } from '@/styles/theme';
import { useColorScheme } from 'react-native';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { settings } = useSettings();

  // Determine which theme to use based on settings preference
  let effectiveColorScheme = systemColorScheme || 'light';

  if (settings.themePreference === 'light') {
    effectiveColorScheme = 'light';
  } else if (settings.themePreference === 'dark') {
    effectiveColorScheme = 'dark';
  }
  // If 'auto', use system theme (already set above)

  return getTheme(effectiveColorScheme);
};
