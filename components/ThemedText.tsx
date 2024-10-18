import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface ThemedTextProps extends TextProps {
  type?: 'title' | 'subtitle' | 'body' | 'small';
}

export const ThemedText: React.FC<ThemedTextProps> = ({ 
  style, 
  type = 'body', 
  ...props 
}) => {
  const theme = useTheme();
  return (
    <Text
      style={[
        styles.base,
        styles[type],
        { color: theme.colors.text },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  base: {},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
  small: {
    fontSize: 14,
  },
});
