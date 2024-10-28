import { Theme } from '@react-navigation/native';

export const DefaultTheme: Theme = {
  dark: false,
  colors: {
    primary: '#A1E4B6',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#2E3D59',
    border: '#CCCCCC',
    notification: '#F76C5E',
    accent: '#F76C5E',
    secondary: '#FCEED9',
  },
};

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#6BAF7E',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#333333',
    notification: '#F76C5E',
    accent: '#F76C5E',
    secondary: '#3D3B38',
  },
};
