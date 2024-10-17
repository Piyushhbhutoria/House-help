import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { theme } from '@/styles/theme';

const HouseHelpFormScreen: React.FC = () => {
  const router = useRouter();
  const { houseHelpId } = useLocalSearchParams();
  const { addHouseHelp, updateHouseHelp, houseHelps } = useHouseHelp();

  const [name, setName] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [shifts, setShifts] = useState('');

  useEffect(() => {
    if (houseHelpId) {
      const existingHouseHelp = houseHelps.find((hh) => hh.id === houseHelpId);
      if (existingHouseHelp) {
        setName(existingHouseHelp.name);
        setMonthlySalary(existingHouseHelp.monthlySalary.toString());
        setShifts(existingHouseHelp.shifts.toString());
      }
    }
  }, [houseHelpId, houseHelps]);

  const handleSave = () => {
    const houseHelpData = {
      name,
      monthlySalary: parseFloat(monthlySalary),
      shifts: parseInt(shifts, 10),
      dailyWage: parseFloat(monthlySalary) / 30, // Assuming 30 days in a month
    };

    if (houseHelpId) {
      updateHouseHelp(houseHelpId as string, houseHelpData);
    } else {
      addHouseHelp(houseHelpData);
    }

    router.back();
  };

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          {houseHelpId ? 'Edit House Help' : 'Add House Help'}
        </ThemedText>

        <ThemedText type="subtitle">Name</ThemedText>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
          placeholderTextColor={theme.colors.text + '80'}
        />

        <ThemedText type="subtitle">Monthly Salary</ThemedText>
        <TextInput
          style={styles.input}
          value={monthlySalary}
          onChangeText={setMonthlySalary}
          placeholder="Enter monthly salary"
          keyboardType="numeric"
          placeholderTextColor={theme.colors.text + '80'}
        />

        <ThemedText type="subtitle">Number of Shifts</ThemedText>
        <TextInput
          style={styles.input}
          value={shifts}
          onChangeText={setShifts}
          placeholder="Enter number of shifts"
          keyboardType="numeric"
          placeholderTextColor={theme.colors.text + '80'}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <ThemedText style={styles.saveButtonText}>Save</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
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
  input: {
    borderWidth: 1,
    borderColor: theme.colors.text,
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    color: theme.colors.text,
  },
  saveButton: {
    backgroundColor: theme.colors.accent,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HouseHelpFormScreen;
