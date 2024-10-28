import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useTheme } from '@react-navigation/native';

const MoreScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();

  const menuItems = [
    {
      title: 'Calendar',
      icon: 'calendar-outline',
      route: '/calendar',
    },
    {
      title: 'Payments',
      icon: 'wallet-outline',
      route: '/payments',
    },
    {
      title: 'Payment History',
      icon: 'time-outline',
      route: '/payment-history',
    },
    {
      title: 'Settings',
      icon: 'settings-outline',
      route: '/settings',
    },
  ];

  return (
    <SafeAreaWrapper>
      <ScrollView>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>More Options</ThemedText>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.route}
              style={[styles.menuItem, { borderColor: theme.colors.border }]}
              onPress={() => router.push(item.route as any)}
            >
              <TabBarIcon name={item.icon as any} color={theme.colors.text} />
              <ThemedText style={styles.menuItemText}>{item.title}</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
  },
});

export default MoreScreen;
