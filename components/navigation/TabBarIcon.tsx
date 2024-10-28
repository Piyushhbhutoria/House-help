// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface TabBarIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
}

export function TabBarIcon({ name, color, size = 24 }: TabBarIconProps) {
  return <Ionicons size={size} name={name} color={color} />;
}
