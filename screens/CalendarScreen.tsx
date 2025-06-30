import { AttendanceMarker } from '@/components/AttendanceMarker';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAttendance } from '@/contexts/AttendanceContext';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

const CalendarScreen: React.FC = () => {
  const { houseHelps } = useHouseHelp();
  const { attendances, getAttendanceForDate } = useAttendance();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markedDates, setMarkedDates] = useState({});
  const [showAllHelps, setShowAllHelps] = useState(false);
  const theme = useTheme() as any;

  // Get day of week for selected date
  const selectedDayOfWeek = useMemo(() => {
    return new Date(selectedDate).getDay();
  }, [selectedDate]);

  // Filter house helps that are supposed to work on selected date
  const workingOnDateHelps = useMemo(() => {
    return houseHelps.filter(houseHelp => {
      // If showAllHelps is true, show all regardless of working days
      if (showAllHelps) return true;

      // If workingDays is not set (for backward compatibility), show all
      if (!houseHelp.workingDays || houseHelp.workingDays.length === 0) {
        return true;
      }
      // Check if selected day is in their working days
      return houseHelp.workingDays.includes(selectedDayOfWeek);
    });
  }, [houseHelps, selectedDayOfWeek, showAllHelps]);

  // Calculate attendance summary for selected date
  const attendanceSummary = useMemo(() => {
    const relevantHelps = workingOnDateHelps;
    const attendancesForDate = getAttendanceForDate(selectedDate);

    const present = attendancesForDate.filter(a => a.status === 'present').length;
    const absent = attendancesForDate.filter(a => a.status === 'absent').length;
    const halfDay = attendancesForDate.filter(a => a.status === 'half-day').length;
    const notMarked = relevantHelps.length - attendancesForDate.length;

    return { present, absent, halfDay, notMarked, total: relevantHelps.length };
  }, [workingOnDateHelps, selectedDate, getAttendanceForDate]);

  useEffect(() => {
    // Create marked dates with color coding based on attendance
    const marked: Record<string, any> = {};

    // Group attendances by date
    const attendancesByDate: Record<string, any[]> = attendances.reduce((acc: Record<string, any[]>, attendance) => {
      if (!acc[attendance.date]) {
        acc[attendance.date] = [];
      }
      acc[attendance.date].push(attendance);
      return acc;
    }, {});

    // Mark dates with attendance data
    Object.keys(attendancesByDate).forEach(date => {
      const dateAttendances = attendancesByDate[date];
      const hasPresent = dateAttendances.some((a: any) => a.status === 'present');
      const hasAbsent = dateAttendances.some((a: any) => a.status === 'absent');
      const hasHalfDay = dateAttendances.some((a: any) => a.status === 'half-day');

      let dotColor = theme.colors.accent;
      if (hasPresent && !hasAbsent && !hasHalfDay) {
        dotColor = '#4CAF50'; // Green for all present
      } else if (hasAbsent && !hasPresent && !hasHalfDay) {
        dotColor = '#F44336'; // Red for all absent  
      } else if (hasHalfDay || (hasPresent && hasAbsent)) {
        dotColor = '#FF9800'; // Orange for mixed or half-day
      }

      marked[date] = { marked: true, dotColor };
    });

    setMarkedDates(marked);
  }, [attendances, theme]);

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const getDayName = (dateString: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(dateString).getDay()];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaWrapper>
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>Calendar</ThemedText>
            <TouchableOpacity
              onPress={() => setShowAllHelps(!showAllHelps)}
              style={[styles.headerButton, { backgroundColor: theme.colors.primary }]}
            >
              <Ionicons
                name={showAllHelps ? "people" : "people-outline"}
                size={16}
                color={theme.colors.background}
              />
              <ThemedText style={[styles.headerButtonText, { color: theme.colors.background }]}>
                {showAllHelps ? 'All' : 'Today'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Compact Calendar */}
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={onDayPress}
              markedDates={{
                ...markedDates,
                [selectedDate]: {
                  selected: true,
                  selectedColor: theme.colors.primary,
                  ...(markedDates as any)[selectedDate]
                },
              }}
              theme={{
                calendarBackground: theme.colors.background,
                textSectionTitleColor: theme.colors.text,
                selectedDayBackgroundColor: theme.colors.primary,
                selectedDayTextColor: theme.colors.background,
                todayTextColor: theme.colors.accent,
                dayTextColor: theme.colors.text,
                textDisabledColor: theme.colors.text + '50',
                dotColor: theme.colors.accent,
                selectedDotColor: theme.colors.background,
                arrowColor: theme.colors.primary,
                monthTextColor: theme.colors.text,
                indicatorColor: theme.colors.primary,
              }}
              style={[styles.calendar, {
                borderWidth: 1,
                borderColor: theme.colors.border || theme.colors.text + '20'
              }]}
            />
          </View>

          {/* Compact Date Info with Summary */}
          <ThemedView style={[styles.compactInfo, { backgroundColor: theme.colors.card }]}>
            <View style={styles.infoHeader}>
              <ThemedText type="subtitle" style={styles.dateText}>
                {formatDate(selectedDate)}
              </ThemedText>

              {/* Legend */}
              <View style={styles.compactLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                  <ThemedText style={styles.legendText}>Present</ThemedText>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
                  <ThemedText style={styles.legendText}>Mixed</ThemedText>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
                  <ThemedText style={styles.legendText}>Absent</ThemedText>
                </View>
              </View>
            </View>

            {/* Summary Stats */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <ThemedText style={[styles.summaryNumber, { color: '#4CAF50' }]}>
                  {attendanceSummary.present}
                </ThemedText>
                <ThemedText style={styles.summaryLabel}>Present</ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <ThemedText style={[styles.summaryNumber, { color: '#FF9800' }]}>
                  {attendanceSummary.halfDay}
                </ThemedText>
                <ThemedText style={styles.summaryLabel}>Half</ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <ThemedText style={[styles.summaryNumber, { color: '#F44336' }]}>
                  {attendanceSummary.absent}
                </ThemedText>
                <ThemedText style={styles.summaryLabel}>Absent</ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <ThemedText style={[styles.summaryNumber, { color: theme.colors.text }]}>
                  {attendanceSummary.notMarked}
                </ThemedText>
                <ThemedText style={styles.summaryLabel}>Pending</ThemedText>
              </View>
            </View>
          </ThemedView>

          {/* Filter Info */}
          {workingOnDateHelps.length !== houseHelps.length && !showAllHelps && (
            <ThemedText style={[styles.filterInfo, { color: theme.colors.text }]}>
              {workingOnDateHelps.length} of {houseHelps.length} scheduled for {getDayName(selectedDate)}
            </ThemedText>
          )}

          {/* House Helps List - Now part of ScrollView */}
          <View style={styles.helpsList}>
            {workingOnDateHelps.length > 0 ? (
              workingOnDateHelps.map((item) => (
                <AttendanceMarker key={item.id} houseHelp={item} date={selectedDate} />
              ))
            ) : (
              <ThemedView style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>
                  {houseHelps.length === 0
                    ? 'No house helps added yet.'
                    : showAllHelps
                      ? 'No house helps found.'
                      : `No house helps scheduled for ${getDayName(selectedDate)}.`}
                </ThemedText>
              </ThemedView>
            )}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  dateTitle: {
    flex: 1,
    textAlign: 'left',
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 11,
    opacity: 0.8,
  },
  dateInfo: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
  },
  filterText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
  filterInfo: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
  },
  headerButtonText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  calendarContainer: {
    marginBottom: 16,
  },
  calendar: {
    borderRadius: 8,
  },
  compactInfo: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    flex: 1,
    textAlign: 'left',
  },
  compactLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  helpsList: {
    paddingBottom: 20,
  },
});

export default CalendarScreen;
