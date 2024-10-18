import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useTheme } from '@react-navigation/native';
import { HouseHelp } from '@/contexts/HouseHelpContext';
import { useAttendance } from '@/contexts/AttendanceContext';

interface AttendanceMarkerProps {
  houseHelp: HouseHelp;
  date: string;
}

export const AttendanceMarker: React.FC<AttendanceMarkerProps> = ({ houseHelp, date }) => {
  const { attendances, addAttendance, updateAttendance } = useAttendance();
  const theme = useTheme();
  const [currentStatus, setCurrentStatus] = useState<'present' | 'absent' | 'half-day' | null>(null);

  useEffect(() => {
    const attendance = attendances.find(
      (a) => a.houseHelpId === houseHelp.id && a.date === date
    );
    if (attendance) {
      setCurrentStatus(attendance.status as 'present' | 'absent' | 'half-day');
    } else {
      setCurrentStatus(null);
    }
  }, [attendances, houseHelp.id, date]);

  const markAttendance = (status: 'present' | 'absent' | 'half-day') => {
    const shiftsCompleted = status === 'present' ? houseHelp.shifts : status === 'half-day' ? Math.floor(houseHelp.shifts / 2) : 0;
    
    const existingAttendance = attendances.find(
      (a) => a.houseHelpId === houseHelp.id && a.date === date
    );

    if (existingAttendance) {
      updateAttendance(existingAttendance.id, { status, shiftsCompleted });
    } else {
      addAttendance({
        id: Date.now().toString(), // Generate a unique ID
        houseHelpId: houseHelp.id,
        date,
        status,
        shiftsCompleted,
      });
    }
    setCurrentStatus(status);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">{houseHelp.name}</ThemedText>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            currentStatus === 'present' && styles.activeButton,
            { backgroundColor: currentStatus === 'present' ? theme.colors.accent : theme.colors.primary }
          ]}
          onPress={() => markAttendance('present')}
        >
          <ThemedText style={styles.buttonText}>Present</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            currentStatus === 'absent' && styles.activeButton,
            { backgroundColor: currentStatus === 'absent' ? theme.colors.accent : theme.colors.primary }
          ]}
          onPress={() => markAttendance('absent')}
        >
          <ThemedText style={styles.buttonText}>Absent</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            currentStatus === 'half-day' && styles.activeButton,
            { backgroundColor: currentStatus === 'half-day' ? theme.colors.accent : theme.colors.primary }
          ]}
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeButton: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  buttonText: {
    color: 'text',
  },
});
