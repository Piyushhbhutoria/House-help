import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { useTheme } from '@react-navigation/native';

const AddHouseHelpScreen: React.FC = () => {
  const router = useRouter();
  const { addHouseHelp } = useHouseHelp();
  const theme = useTheme();

  const [name, setName] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [shifts, setShifts] = useState('');

  const handleSave = () => {
    const houseHelpData = {
      name,
      monthlySalary: parseFloat(monthlySalary),
      shifts: parseInt(shifts, 10),
      dailyWage: parseFloat(monthlySalary) / 30, // Assuming 30 days in a month
    };

    addHouseHelp(houseHelpData);
    router.back();
  };

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Add House Help</ThemedText>

        <ThemedText type="subtitle">Name</ThemedText>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.text, color: theme.colors.text }]}
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
          placeholderTextColor={theme.colors.text + '80'}
        />

        <ThemedText type="subtitle">Monthly Salary</ThemedText>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.text, color: theme.colors.text }]}
          value={monthlySalary}
          onChangeText={setMonthlySalary}
          placeholder="Enter monthly salary"
          keyboardType="numeric"
          placeholderTextColor={theme.colors.text + '80'}
        />

        <ThemedText type="subtitle">Number of Shifts</ThemedText>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.text, color: theme.colors.text }]}
          value={shifts}
          onChangeText={setShifts}
          placeholder="Enter number of shifts"
          keyboardType="numeric"
          placeholderTextColor={theme.colors.text + '80'}
        />

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]} 
          onPress={handleSave}
        >
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
  },
  title: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  saveButton: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddHouseHelpScreen;
