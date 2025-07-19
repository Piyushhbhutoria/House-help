import { AttendanceMarker } from '@/components/AttendanceMarker';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAttendance } from '@/contexts/AttendanceContext';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { useTheme } from '@/hooks/useTheme';
import { borderRadius, shadows, spacing, typography } from '@/utils/spacing';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Button, Divider, Icon } from 'react-native-elements';

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

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerContent}>
        <ThemedView style={styles.titleSection}>
          <ThemedText style={[styles.title, { color: theme.colors.text }]}>
            Calendar
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.colors.text }]}>
            View and manage attendance across dates
          </ThemedText>
        </ThemedView>
        <Button
          title={showAllHelps ? 'All' : 'Today'}
          onPress={() => setShowAllHelps(!showAllHelps)}
          icon={
            <Icon
              name={showAllHelps ? "people" : "people-outline"}
              type="ionicon"
              size={16}
              color="#FFFFFF"
              style={{ marginRight: spacing.sm }}
            />
          }
          buttonStyle={[styles.filterButton, { backgroundColor: theme.colors.primary }]}
          titleStyle={styles.filterButtonText}
          containerStyle={styles.filterButtonContainer}
        />
      </ThemedView>
    </ThemedView>
  );

  const renderCalendar = () => (
    <ThemedView style={styles.calendarContainer}>
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
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: theme.colors.accent,
          dayTextColor: theme.colors.text,
          textDisabledColor: theme.colors.text + '50',
          dotColor: theme.colors.accent,
          selectedDotColor: '#FFFFFF',
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.text,
          indicatorColor: theme.colors.primary,
        }}
        style={[styles.calendar, { borderWidth: 0 }]}
      />
    </ThemedView>
  );

  const renderDateInfo = () => (
    <ThemedView style={styles.dateInfoCard}>
      <ThemedView style={styles.dateHeader}>
        <ThemedView style={styles.dateSection}>
          <Icon
            name="calendar-outline"
            type="ionicon"
            size={20}
            color={theme.colors.primary}
          />
          <ThemedView style={styles.dateTextContainer}>
            <ThemedText style={[styles.dateText, { color: theme.colors.text }]}>
              {formatDate(selectedDate)}
            </ThemedText>
            <ThemedText style={[styles.dayName, { color: theme.colors.text }]}>
              {getDayName(selectedDate)}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.legendContainer}>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
            <ThemedText style={[styles.legendText, { color: theme.colors.text }]}>Present</ThemedText>
          </ThemedView>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
            <ThemedText style={[styles.legendText, { color: theme.colors.text }]}>Mixed</ThemedText>
          </ThemedView>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
            <ThemedText style={[styles.legendText, { color: theme.colors.text }]}>Absent</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <Divider style={{ marginVertical: spacing.md }} />

      <ThemedView style={styles.summaryContainer}>
        <ThemedView style={styles.summaryItem}>
          <ThemedText style={[styles.summaryNumber, { color: '#4CAF50' }]}>
            {attendanceSummary.present}
          </ThemedText>
          <ThemedText style={[styles.summaryLabel, { color: theme.colors.text }]}>Present</ThemedText>
        </ThemedView>
        <ThemedView style={styles.summaryItem}>
          <ThemedText style={[styles.summaryNumber, { color: '#FF9800' }]}>
            {attendanceSummary.halfDay}
          </ThemedText>
          <ThemedText style={[styles.summaryLabel, { color: theme.colors.text }]}>Half</ThemedText>
        </ThemedView>
        <ThemedView style={styles.summaryItem}>
          <ThemedText style={[styles.summaryNumber, { color: '#F44336' }]}>
            {attendanceSummary.absent}
          </ThemedText>
          <ThemedText style={[styles.summaryLabel, { color: theme.colors.text }]}>Absent</ThemedText>
        </ThemedView>
        <ThemedView style={styles.summaryItem}>
          <ThemedText style={[styles.summaryNumber, { color: theme.colors.text }]}>
            {attendanceSummary.notMarked}
          </ThemedText>
          <ThemedText style={[styles.summaryLabel, { color: theme.colors.text }]}>Pending</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderFilterInfo = () => {
    if (workingOnDateHelps.length !== houseHelps.length && !showAllHelps) {
      return (
        <ThemedView style={styles.filterInfo}>
          <Icon
            name="information-circle-outline"
            type="ionicon"
            size={16}
            color={theme.colors.text + '60'}
          />
          <ThemedText style={[styles.filterText, { color: theme.colors.text }]}>
            {workingOnDateHelps.length} of {houseHelps.length} scheduled for {getDayName(selectedDate)}
          </ThemedText>
        </ThemedView>
      );
    }
    return null;
  };

  const renderEmptyState = () => (
    <ThemedView style={styles.emptyContainer}>
      <Icon
        name="calendar-outline"
        type="ionicon"
        size={64}
        color={theme.colors.text + '40'}
        style={styles.emptyIcon}
      />
      <ThemedText style={[styles.emptyTitle, { color: theme.colors.text }]}>
        {houseHelps.length === 0 ? 'No House Help Added' : 'No Work Scheduled'}
      </ThemedText>
      <ThemedText style={[styles.emptyText, { color: theme.colors.text }]}>
        {houseHelps.length === 0
          ? 'Add house helpers first to view their attendance calendar.'
          : showAllHelps
            ? 'No house helpers found for the selected date.'
            : `No house helpers are scheduled for ${getDayName(selectedDate)}.`}
      </ThemedText>
    </ThemedView>
  );

  return (
    <SafeAreaWrapper>
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderHeader()}
          {renderCalendar()}
          {renderDateInfo()}
          {renderFilterInfo()}

          <ThemedView style={styles.helpsList}>
            {workingOnDateHelps.length > 0 ? (
              workingOnDateHelps.map((item) => (
                <AttendanceMarker key={item.id} houseHelp={item} date={selectedDate} />
              ))
            ) : (
              renderEmptyState()
            )}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
    marginRight: spacing.lg,
  },
  title: {
    ...typography.title1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.subhead,
    opacity: 0.7,
    lineHeight: 20,
  },
  filterButtonContainer: {
    alignSelf: 'flex-start',
  },
  filterButton: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  filterButtonText: {
    color: '#FFFFFF',
    ...typography.subhead,
    fontWeight: '600',
  },
  calendarContainer: {
    marginBottom: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  calendar: {
    borderRadius: borderRadius.lg,
  },
  dateInfoCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateTextContainer: {
    marginLeft: spacing.md,
  },
  dateText: {
    ...typography.headline,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  dayName: {
    ...typography.caption1,
    opacity: 0.7,
  },
  legendContainer: {
    alignItems: 'flex-end',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  legendText: {
    ...typography.caption2,
    opacity: 0.8,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    ...typography.title2,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    ...typography.caption1,
    opacity: 0.7,
  },
  filterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  filterText: {
    ...typography.caption1,
    marginLeft: spacing.sm,
    flex: 1,
  },
  helpsList: {
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    ...typography.title2,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
});

export default CalendarScreen;
