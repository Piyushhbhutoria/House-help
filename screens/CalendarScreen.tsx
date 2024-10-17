import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { AttendanceMarker } from '@/components/AttendanceMarker';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { useAttendance } from '@/contexts/AttendanceContext';
import { theme } from '@/styles/theme';

const CalendarScreen: React.FC = () => {
  const { houseHelps } = useHouseHelp();
  const { attendances, getAttendanceForDate } = useAttendance();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const marked = attendances.reduce((acc, attendance) => {
      if (!acc[attendance.date]) {
        acc[attendance.date] = { marked: true, dotColor: theme.colors.accent };
      }
      return acc;
    }, {});
    setMarkedDates(marked);
  }, [attendances]);

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  return (
    <ThemedView style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, selectedColor: theme.colors.accent },
        }}
        theme={{
          calendarBackground: theme.colors.primary,
          textSectionTitleColor: theme.colors.text,
          selectedDayBackgroundColor: theme.colors.accent,
          selectedDayTextColor: '#ffffff',
          todayTextColor: theme.colors.accent,
          dayTextColor: theme.colors.text,
          textDisabledColor: `${theme.colors.text}50`,
          dotColor: theme.colors.accent,
          selectedDotColor: '#ffffff',
          arrowColor: theme.colors.accent,
          monthTextColor: theme.colors.text,
          indicatorColor: theme.colors.accent,
        }}
      />
      <ThemedText type="subtitle" style={styles.dateTitle}>{selectedDate}</ThemedText>
      <FlatList
        data={houseHelps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AttendanceMarker houseHelp={item} date={selectedDate} />}
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
  dateTitle: {
    marginVertical: 16,
    textAlign: 'center',
    color: theme.colors.text,
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

export default CalendarScreen;