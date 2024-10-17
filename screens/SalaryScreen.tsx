import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { useAttendance } from '@/contexts/AttendanceContext';
import { theme } from '@/styles/theme';

const SalaryScreen: React.FC = () => {
  const { houseHelps } = useHouseHelp();
  const { calculateSalary } = useAttendance();
  const [currentMonth, setCurrentMonth] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const monthString = month.toString().padStart(2, '0');
    setCurrentMonth(`${year}-${monthString}`);
    setStartDate(`${year}-${monthString}-01`);
    setEndDate(`${year}-${monthString}-${new Date(year, month, 0).getDate()}`);
  }, []);

  const renderSalaryItem = ({ item: houseHelp }) => {
    const salaryInfo = calculateSalary(houseHelp, startDate, endDate);

    return (
      <ThemedView style={styles.salaryItem}>
        <ThemedText type="subtitle">{houseHelp.name}</ThemedText>
        <ThemedText>Monthly Salary: ₹{houseHelp.monthlySalary}</ThemedText>
        <ThemedText>Total Days: {salaryInfo.totalDays}</ThemedText>
        <ThemedText>Present Days: {salaryInfo.presentDays}</ThemedText>
        <ThemedText>Half Days: {salaryInfo.halfDays}</ThemedText>
        <ThemedText>Total Shifts: {salaryInfo.totalShifts}</ThemedText>
        <ThemedText type="subtitle">Calculated Salary: ₹{salaryInfo.totalSalary.toFixed(2)}</ThemedText>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Salary Information</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>{currentMonth}</ThemedText>
      <FlatList
        data={houseHelps}
        keyExtractor={(item) => item.id}
        renderItem={renderSalaryItem}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No house helps added yet.</ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.primary,
  },
  title: {
    marginBottom: 8,
    color: theme.colors.text,
  },
  subtitle: {
    marginBottom: 16,
    color: theme.colors.text,
  },
  salaryItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.secondary,
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.accent,
  },
});

export default SalaryScreen;