import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { AttendanceMarker } from '@/components/AttendanceMarker';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { theme } from '@/styles/theme';

const AttendanceScreen: React.FC = () => {
  const { houseHelps } = useHouseHelp();
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Mark Attendance</ThemedText>
      <ThemedText type="subtitle" style={styles.date}>{currentDate}</ThemedText>
      <FlatList
        data={houseHelps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AttendanceMarker houseHelp={item} date={currentDate} />}
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
  title: {
    marginBottom: 8,
    color: theme.colors.text,
  },
  date: {
    marginBottom: 16,
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

export default AttendanceScreen;
