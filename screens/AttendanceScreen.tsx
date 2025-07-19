import { AttendanceMarker } from '@/components/AttendanceMarker';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { borderRadius, shadows, spacing, typography } from '@/utils/spacing';
import { useTheme } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

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

  const getDayIcon = (dayIndex: number) => {
    const icons = ['sunny', 'calendar', 'calendar', 'calendar', 'calendar', 'calendar', 'calendar'];
    return icons[dayIndex];
  };

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerContent}>
        <ThemedView style={styles.titleSection}>
          <ThemedText style={[styles.title, { color: theme.colors.text }]}>
            Mark Attendance
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.colors.text }]}>
            Track daily attendance for your house helpers
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={[styles.dateCard]}>
        <ThemedView style={styles.dateContent}>
          <Icon
            name={getDayIcon(currentDayOfWeek)}
            type="ionicon"
            size={24}
            color={theme.colors.primary}
          />
          <ThemedView style={styles.dateInfo}>
            <ThemedText style={[styles.dayName, { color: theme.colors.text }]}>
              {getDayName(currentDayOfWeek)}
            </ThemedText>
            <ThemedText style={[styles.dateText, { color: theme.colors.text }]}>
              {currentDate}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {workingTodayHelps.length !== houseHelps.length && (
        <ThemedView style={[styles.filterInfo]}>
          <Icon
            name="information-circle-outline"
            type="ionicon"
            size={16}
            color={theme.colors.text + '60'}
          />
          <ThemedText style={[styles.filterText, { color: theme.colors.text }]}>
            Showing {workingTodayHelps.length} of {houseHelps.length} house helps scheduled for today
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );

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
          ? 'Add house helpers first to start tracking their attendance.'
          : 'No house helpers are scheduled to work today.'}
      </ThemedText>
    </ThemedView>
  );

  return (
    <SafeAreaWrapper>
      <ThemedView style={styles.container}>
        <FlatList
          data={workingTodayHelps}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AttendanceMarker houseHelp={item} date={currentDate} />}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
        />
      </ThemedView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerContent: {
    marginBottom: spacing.lg,
  },
  titleSection: {
    marginBottom: spacing.lg,
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
  dateCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  dayName: {
    ...typography.headline,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  dateText: {
    ...typography.subhead,
    opacity: 0.7,
  },
  filterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  filterText: {
    ...typography.caption1,
    marginLeft: spacing.sm,
    flex: 1,
  },
  separator: {
    height: spacing.md,
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

export default AttendanceScreen;
