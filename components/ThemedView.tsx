import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface ThemedViewProps extends ViewProps {
  backgroundColor?: keyof Theme['colors'];
}

export const ThemedView: React.FC<ThemedViewProps> = ({ 
  style, 
  backgroundColor = 'background', 
  ...props 
}) => {
  const theme = useTheme();
  return (
    <View
      style={[
        { backgroundColor: theme.colors[backgroundColor] },
        style,
      ]}
      {...props}
    />
  );
};
