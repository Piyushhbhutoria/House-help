import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { AttendanceMarker } from '@/components/AttendanceMarker';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { useTheme } from '@react-navigation/native';

const AttendanceScreen: React.FC = () => {
  const { houseHelps } = useHouseHelp();
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const theme = useTheme();

  return (
    <SafeAreaWrapper>
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
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  date: {
    marginBottom: 16,
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});

export default AttendanceScreen;
