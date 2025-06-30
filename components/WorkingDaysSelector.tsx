import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface WorkingDaysSelectorProps {
  selectedDays: number[];
  onDaysChange: (days: number[]) => void;
}

const DAYS_OF_WEEK = [
  { index: 0, short: 'S', full: 'Sunday' },
  { index: 1, short: 'M', full: 'Monday' },
  { index: 2, short: 'T', full: 'Tuesday' },
  { index: 3, short: 'W', full: 'Wednesday' },
  { index: 4, short: 'T', full: 'Thursday' },
  { index: 5, short: 'F', full: 'Friday' },
  { index: 6, short: 'S', full: 'Saturday' },
];

export const WorkingDaysSelector: React.FC<WorkingDaysSelectorProps> = ({
  selectedDays,
  onDaysChange,
}) => {
  const theme = useTheme() as any; // Cast to any to access extended theme properties

  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      onDaysChange(selectedDays.filter(day => day !== dayIndex));
    } else {
      onDaysChange([...selectedDays, dayIndex].sort());
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>Working Days</ThemedText>
      <View style={styles.daysContainer}>
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = selectedDays.includes(day.index);
          return (
            <TouchableOpacity
              key={day.index}
              style={[
                styles.dayButton,
                {
                  backgroundColor: isSelected ? theme.colors.primary : theme.colors.card,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                }
              ]}
              onPress={() => toggleDay(day.index)}
            >
              <ThemedText
                style={[
                  styles.dayText,
                  {
                    color: isSelected ? theme.colors.background : theme.colors.text,
                    fontWeight: isSelected ? '600' : '400',
                  }
                ]}
              >
                {day.short}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
      {selectedDays.length > 0 && (
        <ThemedText style={[styles.selectedText, { color: theme.colors.text }]}>
          Works on: {selectedDays.map(day => DAYS_OF_WEEK[day].full).join(', ')}
        </ThemedText>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
  },
  selectedText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
}); 
