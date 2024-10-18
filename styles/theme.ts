import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

export const lightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#A1E4B6',
    secondary: '#F5F5F5',
    accent: '#F76C5E',
    text: '#2E3D59',
    background: '#FCEED9',
  },
};

export const darkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#6DB28F',
    secondary: '#2B303B',
    accent: '#E35B52',
    text: '#D0F4D8',
    background: '#1C2431',
  },
};

export const getTheme = (colorScheme: 'light' | 'dark') => 
  colorScheme === 'dark' ? darkTheme : lightTheme;
