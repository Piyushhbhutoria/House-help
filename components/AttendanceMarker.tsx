import { useAttendance } from '@/contexts/AttendanceContext';
import { HouseHelp } from '@/contexts/HouseHelpContext';
import { useTheme } from '@/hooks/useTheme';
import { borderRadius, shadows, spacing, typography } from '@/utils/spacing';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Divider, Icon } from 'react-native-elements';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface AttendanceMarkerProps {
  houseHelp: HouseHelp;
  date: string;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AttendanceMarker: React.FC<AttendanceMarkerProps> = ({ houseHelp, date }) => {
  const { attendances, addAttendance, updateAttendance } = useAttendance();
  const theme = useTheme() as any; // Cast to any to access extended theme properties
  const [currentShifts, setCurrentShifts] = useState<number>(0);

  useEffect(() => {
    const attendance = attendances.find(
      (a) => a.houseHelpId === houseHelp.id && a.date === date
    );
    if (attendance) {
      setCurrentShifts(attendance.shiftsCompleted);
    } else {
      setCurrentShifts(0);
    }
  }, [attendances, houseHelp.id, date]);

  const markAttendance = (shiftsCompleted: number) => {
    // Determine status based on shifts completed
    let status: 'present' | 'absent' | 'half-day';
    if (shiftsCompleted === 0) {
      status = 'absent';
    } else if (shiftsCompleted === houseHelp.shifts) {
      status = 'present';
    } else {
      status = 'half-day'; // Partial shifts
    }

    const existingAttendance = attendances.find(
      (a) => a.houseHelpId === houseHelp.id && a.date === date
    );

    if (existingAttendance) {
      updateAttendance(existingAttendance.id, { status, shiftsCompleted });
    } else {
      addAttendance({
        houseHelpId: houseHelp.id,
        date,
        status,
        shiftsCompleted,
      });
    }
    setCurrentShifts(shiftsCompleted);
  };

  const getWorkingDaysText = () => {
    if (!houseHelp.workingDays || houseHelp.workingDays.length === 0) {
      return 'Works every day';
    }
    if (houseHelp.workingDays.length === 7) {
      return 'Works every day';
    }
    return `Works on: ${houseHelp.workingDays.map(day => DAYS_OF_WEEK[day]).join(', ')}`;
  };

  const getStatusColor = () => {
    if (currentShifts === 0) return theme.colors.accent;
    if (currentShifts === houseHelp.shifts) return theme.colors.accent;
    return theme.colors.accent;
  };

  const getStatusText = () => {
    if (currentShifts === 0) return 'Absent';
    if (currentShifts === houseHelp.shifts) return 'Present';
    return 'Partial';
  };

  return (
    <ThemedView style={[styles.container]}>
      {/* Header with name and status */}
      <ThemedView style={styles.header}>
        <ThemedView style={styles.nameSection}>
          <ThemedView style={[styles.avatarContainer, { backgroundColor: theme.colors.primary + '20' }]}>
            <Icon
              name="person"
              type="ionicon"
              size={18}
              color={theme.colors.primary}
            />
          </ThemedView>
          <ThemedView style={styles.nameContainer}>
            <ThemedText style={[styles.name, { color: theme.colors.text }]}>
              {houseHelp.name}
            </ThemedText>
            <ThemedText style={[styles.workingDays, { color: theme.colors.text + '70' }]}>
              {getWorkingDaysText()}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {currentShifts > 0 && (
          <ThemedView style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
            <ThemedText style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>

      <Divider style={{ marginVertical: spacing.md }} />

      {/* Shifts information */}
      <ThemedView style={styles.shiftsInfo}>
        <Icon
          name="time-outline"
          type="ionicon"
          size={16}
          color={theme.colors.text + '60'}
        />
        <ThemedText style={[styles.shiftsText, { color: theme.colors.text }]}>
          Maximum {houseHelp.shifts} shifts per day
        </ThemedText>
      </ThemedView>

      {/* Attendance buttons */}
      <ThemedView style={styles.buttonSection}>
        <ThemedText style={[styles.buttonSectionTitle, { color: theme.colors.text }]}>
          Mark Attendance
        </ThemedText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.buttonScrollContainer}
          contentContainerStyle={styles.buttonContainer}
        >
          {/* Absent button */}
          <Button
            title="Absent"
            onPress={() => markAttendance(0)}
            buttonStyle={[
              styles.attendanceButton,
              currentShifts === 0 && styles.activeButton,
              {
                backgroundColor: currentShifts === 0 ? theme.colors.accent : theme.colors.primary + '20',
                borderColor: currentShifts === 0 ? theme.colors.accent : theme.colors.primary,
              }
            ]}
            titleStyle={[
              styles.buttonText,
              { color: currentShifts === 0 ? '#FFFFFF' : theme.colors.primary }
            ]}
            containerStyle={styles.buttonWrapper}
          />

          {/* Shift buttons */}
          {Array.from({ length: houseHelp.shifts }, (_, i) => i + 1).map((shiftCount) => (
            <Button
              key={shiftCount}
              title={`${shiftCount} ${shiftCount === 1 ? 'Shift' : 'Shifts'}`}
              onPress={() => markAttendance(shiftCount)}
              buttonStyle={[
                styles.attendanceButton,
                currentShifts === shiftCount && styles.activeButton,
                {
                  backgroundColor: currentShifts === shiftCount ? theme.colors.accent : theme.colors.primary + '20',
                  borderColor: currentShifts === shiftCount ? theme.colors.accent : theme.colors.primary,
                }
              ]}
              titleStyle={[
                styles.buttonText,
                { color: currentShifts === shiftCount ? '#FFFFFF' : theme.colors.primary }
              ]}
              containerStyle={styles.buttonWrapper}
            />
          ))}
        </ScrollView>
      </ThemedView>

      {/* Progress indicator */}
      {currentShifts > 0 && (
        <ThemedView style={styles.progressSection}>
          <ThemedView style={styles.progressBar}>
            <ThemedView
              style={[
                styles.progressFill,
                {
                  width: `${(currentShifts / houseHelp.shifts) * 100}%`,
                  backgroundColor: getStatusColor()
                }
              ]}
            />
          </ThemedView>
          <ThemedText style={[styles.progressText, { color: theme.colors.text }]}>
            {currentShifts} of {houseHelp.shifts} shifts completed
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    ...typography.headline,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  workingDays: {
    ...typography.caption1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    ...typography.caption1,
    fontWeight: '600',
  },
  shiftsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shiftsText: {
    ...typography.caption1,
    marginLeft: spacing.sm,
    opacity: 0.7,
  },
  buttonSection: {
    marginTop: spacing.md,
  },
  buttonSectionTitle: {
    ...typography.subhead,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  buttonScrollContainer: {
    marginTop: spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  buttonWrapper: {
    marginHorizontal: spacing.xs,
  },
  attendanceButton: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    minWidth: 80,
  },
  activeButton: {
    ...shadows.sm,
  },
  buttonText: {
    ...typography.caption1,
    fontWeight: '600',
  },
  progressSection: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    ...typography.caption1,
    fontWeight: '500',
  },
});
