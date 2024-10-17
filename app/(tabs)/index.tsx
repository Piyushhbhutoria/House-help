import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { HouseHelpItem } from '@/components/HouseHelpItem';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { theme } from '@/styles/theme';

const HomeScreen: React.FC = () => {
  const { houseHelps } = useHouseHelp();
  const router = useRouter();

  const handleAddHouseHelp = () => {
    router.push('/add-house-help');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>HouseHelp Manager</ThemedText>
      <TouchableOpacity style={styles.addButton} onPress={handleAddHouseHelp}>
        <ThemedText style={styles.addButtonText}>Add House Help</ThemedText>
      </TouchableOpacity>
      <FlatList
        data={houseHelps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HouseHelpItem houseHelp={item} />}
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
    marginBottom: 16,
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.accent,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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

export default HomeScreen;
