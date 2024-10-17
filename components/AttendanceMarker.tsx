import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { theme } from '@/styles/theme';
import { HouseHelp } from '@/contexts/HouseHelpContext';
import { useAttendance } from '@/contexts/AttendanceContext';

interface AttendanceMarkerProps {
  houseHelp: HouseHelp;
  date: string;
}

export const AttendanceMarker: React.FC<AttendanceMarkerProps> = ({ houseHelp, date }) => {
  const { attendances, addAttendance, updateAttendance } = useAttendance();

  const attendance = attendances.find(
    (a) => a.houseHelpId === houseHelp.id && a.date === date
  );

  const markAttendance = (status: 'present' | 'absent' | 'half-day') => {
    if (attendance) {
      updateAttendance(attendance.id, { status, shiftsCompleted: status === 'present' ? houseHelp.shifts : status === 'half-day' ? Math.floor(houseHelp.shifts / 2) : 0 });
    } else {
      addAttendance({
        houseHelpId: houseHelp.id,
        date,
        status,
        shiftsCompleted: status === 'present' ? houseHelp.shifts : status === 'half-day' ? Math.floor(houseHelp.shifts / 2) : 0,
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">{houseHelp.name}</ThemedText>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, attendance?.status === 'present' && styles.activeButton]}
          onPress={() => markAttendance('present')}
        >
          <ThemedText style={styles.buttonText}>Present</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, attendance?.status === 'absent' && styles.activeButton]}
          onPress={() => markAttendance('absent')}
        >
          <ThemedText style={styles.buttonText}>Absent</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, attendance?.status === 'half-day' && styles.activeButton]}
          onPress={() => markAttendance('half-day')}
        >
          <ThemedText style={styles.buttonText}>Half-day</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.secondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: theme.colors.accent,
  },
  buttonText: {
    color: theme.colors.text,
  },
});
