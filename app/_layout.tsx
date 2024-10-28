import { AttendanceProvider } from '@/contexts/AttendanceContext';
import { HouseHelpProvider } from '@/contexts/HouseHelpContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { useTheme } from '@/hooks/useTheme';
import { initDatabase } from '@/utils/database';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    initDatabase().catch(error => console.error('Failed to initialize database:', error));
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const theme = useTheme();

  return (
    <ThemeProvider value={theme}>
      <SettingsProvider>
        <HouseHelpProvider>
          <AttendanceProvider>
            <PaymentProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="add-house-help" />
                <Stack.Screen name="edit-house-help" />
                <Stack.Screen name="calendar" />
                <Stack.Screen name="payments" />
                <Stack.Screen name="payment-history" />
                <Stack.Screen name="settings" />
              </Stack>
            </PaymentProvider>
          </AttendanceProvider>
        </HouseHelpProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
