import React, { ReactNode } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface SafeAreaWrapperProps {
  children: ReactNode;
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
