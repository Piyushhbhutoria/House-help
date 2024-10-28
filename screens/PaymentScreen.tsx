import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { usePayment } from '@/contexts/PaymentContext';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { useTheme } from '@react-navigation/native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const PaymentScreen: React.FC = () => {
  const { addPayment } = usePayment();
  const { houseHelps } = useHouseHelp();
  const theme = useTheme();

  const [selectedHouseHelp, setSelectedHouseHelp] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'advance' | 'holiday' | 'overtime' | 'adjustment'>('advance');
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    if (!selectedHouseHelp || !amount) return;

    addPayment({
      houseHelpId: selectedHouseHelp,
      amount: parseFloat(amount),
      type,
      date: date.toISOString().split('T')[0],
      description,
    });

    // Reset form
    setAmount('');
    setDescription('');
  };

  return (
    <SafeAreaWrapper>
      <ScrollView>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>Add Payment/Adjustment</ThemedText>

          <ThemedText type="subtitle">Select House Help</ThemedText>
          <ScrollView horizontal style={styles.houseHelpSelector}>
            {houseHelps.map(houseHelp => (
              <TouchableOpacity
                key={houseHelp.id}
                style={[
                  styles.houseHelpButton,
                  {
                    backgroundColor: selectedHouseHelp === houseHelp.id 
                      ? theme.colors.primary 
                      : theme.colors.background,
                    borderColor: theme.colors.primary,
                  }
                ]}
                onPress={() => setSelectedHouseHelp(houseHelp.id)}
              >
                <ThemedText>{houseHelp.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ThemedText type="subtitle">Type</ThemedText>
          <ScrollView horizontal style={styles.typeSelector}>
            {['advance', 'holiday', 'overtime', 'adjustment'].map(t => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: type === t ? theme.colors.primary : theme.colors.background,
                    borderColor: theme.colors.primary,
                  }
                ]}
                onPress={() => setType(t as typeof type)}
              >
                <ThemedText>{t.charAt(0).toUpperCase() + t.slice(1)}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ThemedText type="subtitle">Amount</ThemedText>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.text, color: theme.colors.text }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor={theme.colors.text + '80'}
          />

          <ThemedText type="subtitle">Date</ThemedText>
          <DateTimePicker
            value={date}
            mode="date"
            onChange={handleDateChange}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          />

          <ThemedText type="subtitle">Description</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea, { borderColor: theme.colors.text, color: theme.colors.text }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            placeholderTextColor={theme.colors.text + '80'}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSubmit}
          >
            <ThemedText style={styles.submitButtonText}>Add Payment</ThemedText>
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
    marginBottom: 24,
  },
  houseHelpSelector: {
    marginBottom: 16,
  },
  houseHelpButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
  },
  typeSelector: {
    marginBottom: 16,
  },
  typeButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
