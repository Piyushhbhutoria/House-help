import { AttendanceMarker } from '@/components/AttendanceMarker';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { useTheme } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

const AttendanceScreen: React.FC = () => {
  const { houseHelps } = useHouseHelp();
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const theme = useTheme();

  // Get current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const currentDayOfWeek = new Date().getDay();

  // Filter house helps that are supposed to work today
  const workingTodayHelps = useMemo(() => {
    return houseHelps.filter(houseHelp => {
      // If workingDays is not set (for backward compatibility), show all
      if (!houseHelp.workingDays || houseHelp.workingDays.length === 0) {
        return true;
      }
      // Check if current day is in their working days
      return houseHelp.workingDays.includes(currentDayOfWeek);
    });
  }, [houseHelps, currentDayOfWeek]);

  const getDayName = (dayIndex: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  };

  return (
    <SafeAreaWrapper>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Mark Attendance</ThemedText>
        <ThemedText type="subtitle" style={styles.date}>
          {getDayName(currentDayOfWeek)} - {currentDate}
        </ThemedText>
        {workingTodayHelps.length !== houseHelps.length && (
          <ThemedText style={[styles.filterInfo, { color: theme.colors.text }]}>
            Showing {workingTodayHelps.length} of {houseHelps.length} house helps scheduled for today
          </ThemedText>
        )}
        <FlatList
          data={workingTodayHelps}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AttendanceMarker houseHelp={item} date={currentDate} />}
          ListEmptyComponent={
            <ThemedView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                {houseHelps.length === 0
                  ? 'No house helps added yet.'
                  : 'No house helps are scheduled to work today.'}
              </ThemedText>
            </ThemedView>
          }
        />
      </ThemedView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  date: {
    marginBottom: 16,
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  filterInfo: {
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default AttendanceScreen;
