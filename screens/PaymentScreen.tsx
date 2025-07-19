import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { usePayment } from '@/contexts/PaymentContext';
import { borderRadius, shadows, spacing, typography } from '@/utils/spacing';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';

const PaymentScreen: React.FC = () => {
  const { addPayment } = usePayment();
  const { houseHelps } = useHouseHelp();
  const theme = useTheme();

  const [selectedHouseHelp, setSelectedHouseHelp] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'advance' | 'holiday' | 'overtime' | 'adjustment'>('advance');
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!selectedHouseHelp || !amount) {
      Alert.alert('Error', 'Please select a house help and enter an amount.');
      return;
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    try {
      setLoading(true);
      await addPayment({
        houseHelpId: selectedHouseHelp,
        amount: parseFloat(amount),
        type,
        date: date.toISOString().split('T')[0],
        description,
      });

      // Show success message
      Alert.alert('Success', 'Payment added successfully!');

      // Reset form
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error adding payment:', error);
      Alert.alert('Error', 'Failed to add payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (paymentType: string) => {
    switch (paymentType) {
      case 'advance': return 'cash-outline';
      case 'holiday': return 'calendar-outline';
      case 'overtime': return 'time-outline';
      case 'adjustment': return 'calculator-outline';
      default: return 'card-outline';
    }
  };

  const getTypeColor = (paymentType: string) => {
    switch (paymentType) {
      case 'advance': return '#FF6B6B';
      case 'holiday': return '#4ECDC4';
      case 'overtime': return '#45B7D1';
      case 'adjustment': return '#96CEB4';
      default: return theme.colors.primary;
    }
  };

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerContent}>
        <ThemedView style={styles.titleSection}>
          <ThemedText style={[styles.title, { color: theme.colors.text }]}>
            Add Payment
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.colors.text }]}>
            Record payments, advances, and adjustments
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderHouseHelpSelector = () => (
    <ThemedView style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Select House Help
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorContainer}>
        {houseHelps.map(houseHelp => (
          <Button
            key={houseHelp.id}
            title={houseHelp.name}
            onPress={() => setSelectedHouseHelp(houseHelp.id)}
            buttonStyle={[
              styles.selectorButton,
              {
                backgroundColor: selectedHouseHelp === houseHelp.id
                  ? theme.colors.primary
                  : theme.colors.primary + '20',
                borderColor: theme.colors.primary,
              }
            ]}
            titleStyle={[
              styles.selectorButtonText,
              {
                color: selectedHouseHelp === houseHelp.id
                  ? '#FFFFFF'
                  : theme.colors.primary
              }
            ]}
            containerStyle={styles.selectorButtonContainer}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );

  const renderTypeSelector = () => (
    <ThemedView style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Payment Type
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorContainer}>
        {['advance', 'holiday', 'overtime', 'adjustment'].map(paymentType => (
          <Button
            key={paymentType}
            title={paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}
            onPress={() => setType(paymentType as typeof type)}
            icon={
              <Icon
                name={getTypeIcon(paymentType)}
                type="ionicon"
                size={16}
                color={type === paymentType ? '#FFFFFF' : getTypeColor(paymentType)}
                style={{ marginRight: spacing.xs }}
              />
            }
            buttonStyle={[
              styles.selectorButton,
              {
                backgroundColor: type === paymentType
                  ? getTypeColor(paymentType)
                  : getTypeColor(paymentType) + '20',
                borderColor: getTypeColor(paymentType),
              }
            ]}
            titleStyle={[
              styles.selectorButtonText,
              {
                color: type === paymentType
                  ? '#FFFFFF'
                  : getTypeColor(paymentType)
              }
            ]}
            containerStyle={styles.selectorButtonContainer}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );

  const renderForm = () => (
    <ThemedView style={styles.formSection}>
      <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Payment Details
      </ThemedText>

      <ThemedView style={styles.formCard}>
        <Input
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Enter amount"
          leftIcon={
            <Icon
              name="cash-outline"
              type="ionicon"
              size={20}
              color={theme.colors.text + '60'}
            />
          }
          inputStyle={[styles.input, { color: theme.colors.text }]}
          labelStyle={[styles.inputLabel, { color: theme.colors.text }]}
          inputContainerStyle={[styles.inputContainer, { borderBottomColor: theme.colors.text + '30' }]}
          containerStyle={styles.inputContainerStyle}
        />

        <ThemedView style={styles.dateSection}>
          <ThemedText style={[styles.inputLabel, { color: theme.colors.text }]}>
            Date
          </ThemedText>
          <ThemedView style={styles.dateContainer}>
            <Icon
              name="calendar-outline"
              type="ionicon"
              size={20}
              color={theme.colors.text + '60'}
              style={styles.dateIcon}
            />
            <DateTimePicker
              value={date}
              mode="date"
              onChange={handleDateChange}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              style={styles.datePicker}
            />
          </ThemedView>
        </ThemedView>

        <Input
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          leftIcon={
            <Icon
              name="document-text-outline"
              type="ionicon"
              size={20}
              color={theme.colors.text + '60'}
            />
          }
          inputStyle={[styles.input, { color: theme.colors.text }]}
          labelStyle={[styles.inputLabel, { color: theme.colors.text }]}
          inputContainerStyle={[styles.inputContainer, { borderBottomColor: theme.colors.text + '30' }]}
          containerStyle={styles.inputContainerStyle}
          multiline
          numberOfLines={3}
        />
      </ThemedView>
    </ThemedView>
  );

  const renderSubmitButton = () => (
    <ThemedView style={styles.submitSection}>
      <Button
        title={loading ? 'Adding Payment...' : 'Add Payment'}
        onPress={handleSubmit}
        disabled={loading}
        icon={
          !loading && (
            <Icon
              name="checkmark-circle-outline"
              type="ionicon"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: spacing.sm }}
            />
          )
        }
        buttonStyle={[
          styles.submitButton,
          {
            backgroundColor: loading ? theme.colors.text + '30' : theme.colors.primary,
            opacity: loading ? 0.7 : 1
          }
        ]}
        titleStyle={styles.submitButtonText}
        containerStyle={styles.submitButtonContainer}
      />
    </ThemedView>
  );

  return (
    <SafeAreaWrapper>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {renderHouseHelpSelector()}
        {renderTypeSelector()}
        {renderForm()}
        {renderSubmitButton()}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerContent: {
    marginBottom: spacing.lg,
  },
  titleSection: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.subhead,
    opacity: 0.7,
    lineHeight: 20,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.headline,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  selectorContainer: {
    marginTop: spacing.sm,
  },
  selectorButtonContainer: {
    marginRight: spacing.sm,
  },
  selectorButton: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    ...shadows.sm,
  },
  selectorButtonText: {
    ...typography.subhead,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: spacing.xl,
  },
  formCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  inputContainerStyle: {
    paddingHorizontal: 0,
    marginBottom: spacing.lg,
  },
  input: {
    ...typography.body,
  },
  inputLabel: {
    ...typography.subhead,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  inputContainer: {
    borderBottomWidth: 1,
    paddingHorizontal: 0,
  },
  dateSection: {
    marginBottom: spacing.lg,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  dateIcon: {
    marginRight: spacing.sm,
  },
  datePicker: {
    flex: 1,
  },
  submitSection: {
    marginTop: spacing.lg,
  },
  submitButtonContainer: {
    width: '100%',
  },
  submitButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    ...shadows.md,
  },
  submitButtonText: {
    color: '#FFFFFF',
    ...typography.headline,
    fontWeight: '600',
  },
});

export default PaymentScreen;
