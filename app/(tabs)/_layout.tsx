import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useTheme } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIconStyle: {
          marginBottom: -3,
        },
        tabBarAllowFontScaling: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="salary"
        options={{
          title: 'Salary',
          tabBarIcon: ({ color }) => <TabBarIcon name="cash-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <TabBarIcon name="menu-outline" color={color} />,
          tabBarLabel: 'More',
          unmountOnBlur: true,
        }}
      />
    </Tabs>
  );
}
