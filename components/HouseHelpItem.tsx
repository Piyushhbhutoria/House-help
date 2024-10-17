import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { theme } from '@/styles/theme';
import { HouseHelp } from '@/contexts/HouseHelpContext';

interface HouseHelpItemProps {
  houseHelp: HouseHelp;
}

export const HouseHelpItem: React.FC<HouseHelpItemProps> = ({ houseHelp }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/edit-house-help',
      params: { houseHelpId: houseHelp.id }
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <ThemedView style={styles.container} backgroundColor="secondary">
        <ThemedText type="subtitle">{houseHelp.name}</ThemedText>
        <ThemedText>Monthly Salary: ₹{houseHelp.monthlySalary}</ThemedText>
        <ThemedText>Shifts: {houseHelp.shifts}</ThemedText>
        <ThemedText>Daily Wage: ₹{houseHelp.dailyWage.toFixed(2)}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent,
  },
});
