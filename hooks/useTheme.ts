import { useColorScheme } from 'react-native';
import { getTheme } from '@/styles/theme';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  return getTheme(colorScheme || 'light');
};
