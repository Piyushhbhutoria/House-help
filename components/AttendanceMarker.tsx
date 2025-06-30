import { useAttendance } from '@/contexts/AttendanceContext';
import { HouseHelp } from '@/contexts/HouseHelpContext';
import { useTheme } from '@/hooks/useTheme';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
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

  const generateShiftButtons = () => {
    const buttons = [];

    // Absent button (0 shifts)
    buttons.push(
      <TouchableOpacity
        key={0}
        style={[
          styles.button,
          currentShifts === 0 && styles.activeButton,
          {
            backgroundColor: currentShifts === 0 ? theme.colors.accent : theme.colors.primary,
            borderColor: currentShifts === 0 ? theme.colors.accent : 'transparent'
          }
        ]}
        onPress={() => markAttendance(0)}
      >
        <ThemedText style={[styles.buttonText, { color: theme.colors.background }]}>
          Absent
        </ThemedText>
      </TouchableOpacity>
    );

    // Shift count buttons (1 to max shifts)
    for (let i = 1; i <= houseHelp.shifts; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.button,
            currentShifts === i && styles.activeButton,
            {
              backgroundColor: currentShifts === i ? theme.colors.accent : theme.colors.primary,
              borderColor: currentShifts === i ? theme.colors.accent : 'transparent'
            }
          ]}
          onPress={() => markAttendance(i)}
        >
          <ThemedText style={[styles.buttonText, { color: theme.colors.background }]}>
            {i} {i === 1 ? 'Shift' : 'Shifts'}
          </ThemedText>
        </TouchableOpacity>
      );
    }

    return buttons;
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

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <ThemedText type="subtitle" style={{ color: theme.colors.text }}>
        {houseHelp.name}
      </ThemedText>
      <ThemedText style={[styles.shiftInfo, { color: theme.colors.text }]}>
        Max shifts per day: {houseHelp.shifts}
      </ThemedText>
      <ThemedText style={[styles.workingDaysInfo, { color: theme.colors.text }]}>
        {getWorkingDaysText()}
      </ThemedText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.buttonScrollContainer}
        contentContainerStyle={styles.buttonContainer}
      >
        {generateShiftButtons()}
      </ScrollView>

      {currentShifts > 0 && (
        <ThemedText style={[styles.statusText, { color: theme.colors.accent }]}>
          {currentShifts} of {houseHelp.shifts} shifts completed
        </ThemedText>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  shiftInfo: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  workingDaysInfo: {
    fontSize: 11,
    marginTop: 2,
    opacity: 0.6,
  },
  buttonScrollContainer: {
    marginTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  activeButton: {
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});
