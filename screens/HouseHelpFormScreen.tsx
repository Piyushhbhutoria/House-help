import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const HouseHelpFormScreen: React.FC = () => {
  const router = useRouter();
  const { houseHelpId } = useLocalSearchParams();
  const { addHouseHelp, updateHouseHelp, houseHelps } = useHouseHelp();
  const theme = useTheme();

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
    <SafeAreaWrapper>
      <ScrollView>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            {houseHelpId ? 'Edit House Help' : 'Add House Help'}
          </ThemedText>

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

          <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.colors.accent }]} onPress={handleSave}>
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </SafeAreaWrapper>
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

export default HouseHelpFormScreen;
