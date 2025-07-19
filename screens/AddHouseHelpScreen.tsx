import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { WorkingDaysSelector } from '@/components/WorkingDaysSelector';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { useSettings } from '@/contexts/SettingsContext';
import { formatCurrency } from '@/utils/currency';
import { borderRadius, shadows, spacing, typography } from '@/utils/spacing';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Button,
  Icon,
  Input
} from 'react-native-elements';

const { width } = Dimensions.get('window');

const AddHouseHelpScreen: React.FC = () => {
  const router = useRouter();
  const { addHouseHelp } = useHouseHelp();
  const { settings } = useSettings();
  const theme = useTheme();

  const [name, setName] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [shifts, setShifts] = useState('');
  const [workingDays, setWorkingDays] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  // Set default working days from settings when component loads
  useEffect(() => {
    if (settings.defaultWorkingDays && settings.defaultWorkingDays.length > 0) {
      setWorkingDays(settings.defaultWorkingDays);
    } else {
      // Fallback to Monday-Friday if no default set
      setWorkingDays([1, 2, 3, 4, 5]);
    }

    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [settings.defaultWorkingDays]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!monthlySalary.trim()) {
      newErrors.monthlySalary = 'Monthly salary is required';
    } else if (isNaN(parseFloat(monthlySalary)) || parseFloat(monthlySalary) <= 0) {
      newErrors.monthlySalary = 'Please enter a valid salary amount';
    }

    if (!shifts.trim()) {
      newErrors.shifts = 'Number of shifts is required';
    } else if (isNaN(parseInt(shifts, 10)) || parseInt(shifts, 10) <= 0 || parseInt(shifts, 10) > 3) {
      newErrors.shifts = 'Please enter valid shifts (1-3)';
    }

    if (workingDays.length === 0) {
      newErrors.workingDays = 'Please select at least one working day';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDailyWage = () => {
    if (monthlySalary && !isNaN(parseFloat(monthlySalary))) {
      return parseFloat(monthlySalary) / 30;
    }
    return 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const houseHelpData = {
        name: name.trim(),
        monthlySalary: parseFloat(monthlySalary),
        shifts: parseInt(shifts, 10),
        dailyWage: calculateDailyWage(),
        workingDays,
        overtimeRate: 0,
        holidayRate: 0,
        advancePayment: 0,
        adjustments: 0,
        multipleShifts: false,
      };

      await addHouseHelp(houseHelpData);

      Alert.alert(
        '✅ Success!',
        `${name} has been added successfully.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error adding house help:', error);
      Alert.alert('Error', 'Failed to add house help. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerContent}>
        <ThemedView style={styles.titleSection}>
          <ThemedView style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <Icon
              name="person-add"
              type="ionicon"
              size={24}
              color="#FFFFFF"
            />
          </ThemedView>
          <ThemedText style={[styles.title, { color: theme.colors.text }]}>
            Add New House Help
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.colors.text }]}>
            Enter the details to add a new house helper to your team
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderForm = () => (
    <ThemedView style={styles.formSection}>
      <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Personal Information
      </ThemedText>

      <ThemedView style={styles.formCard}>
        {/* Name Input */}
        <Input
          label="Full Name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            clearError('name');
          }}
          placeholder="Enter full name"
          leftIcon={
            <Icon
              name="person-outline"
              type="ionicon"
              size={20}
              color={theme.colors.text + '60'}
            />
          }
          inputStyle={[styles.input, { color: theme.colors.text }]}
          labelStyle={[styles.inputLabel, { color: theme.colors.text }]}
          placeholderTextColor={theme.colors.text + '60'}
          inputContainerStyle={[
            styles.inputContainer,
            {
              borderBottomColor: errors.name ? '#FF6B6B' : theme.colors.text + '30',
            }
          ]}
          containerStyle={styles.inputWrapper}
          errorMessage={errors.name}
          errorStyle={styles.errorText}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </ThemedView>

      <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Salary & Work Details
      </ThemedText>

      <ThemedView style={styles.formCard}>
        {/* Salary Input */}
        <Input
          label="Monthly Salary"
          value={monthlySalary}
          onChangeText={(text) => {
            setMonthlySalary(text);
            clearError('monthlySalary');
          }}
          placeholder="0"
          leftIcon={
            <ThemedText style={[styles.currencySymbol, { color: theme.colors.text }]}>
              {settings.currencySymbol}
            </ThemedText>
          }
          inputStyle={[styles.input, { color: theme.colors.text }]}
          labelStyle={[styles.inputLabel, { color: theme.colors.text }]}
          placeholderTextColor={theme.colors.text + '60'}
          inputContainerStyle={[
            styles.inputContainer,
            {
              borderBottomColor: errors.monthlySalary ? '#FF6B6B' : theme.colors.text + '30',
            }
          ]}
          containerStyle={styles.inputWrapper}
          errorMessage={errors.monthlySalary}
          errorStyle={styles.errorText}
          keyboardType="numeric"
        />

        {/* Daily Wage Preview */}
        {monthlySalary && !isNaN(parseFloat(monthlySalary)) && (
          <ThemedView style={[styles.previewContainer, { backgroundColor: theme.colors.primary + '10' }]}>
            <Icon
              name="calculator-outline"
              type="ionicon"
              size={16}
              color={theme.colors.primary}
            />
            <ThemedText style={[styles.previewText, { color: theme.colors.primary }]}>
              Daily wage: {formatCurrency(calculateDailyWage(), settings)}
            </ThemedText>
          </ThemedView>
        )}

        {/* Shifts Input */}
        <Input
          label="Shifts per Day"
          value={shifts}
          onChangeText={(text) => {
            setShifts(text);
            clearError('shifts');
          }}
          placeholder="1"
          leftIcon={
            <Icon
              name="time-outline"
              type="ionicon"
              size={20}
              color={theme.colors.text + '60'}
            />
          }
          inputStyle={[styles.input, { color: theme.colors.text }]}
          labelStyle={[styles.inputLabel, { color: theme.colors.text }]}
          placeholderTextColor={theme.colors.text + '60'}
          inputContainerStyle={[
            styles.inputContainer,
            {
              borderBottomColor: errors.shifts ? '#FF6B6B' : theme.colors.text + '30',
            }
          ]}
          containerStyle={styles.inputWrapper}
          errorMessage={errors.shifts}
          errorStyle={styles.errorText}
          keyboardType="numeric"
          maxLength={1}
        />

        <ThemedView style={styles.helperContainer}>
          <Icon
            name="bulb-outline"
            type="ionicon"
            size={16}
            color={theme.colors.text + '50'}
          />
          <ThemedText style={[styles.helperText, { color: theme.colors.text + '70' }]}>
            Typically 1-3 shifts per day (morning, afternoon, evening)
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Working Schedule
      </ThemedText>

      <ThemedView style={styles.formCard}>
        <ThemedText style={[styles.workingDaysLabel, { color: theme.colors.text }]}>
          Select Working Days
        </ThemedText>
        <WorkingDaysSelector
          selectedDays={workingDays}
          onDaysChange={(days) => {
            setWorkingDays(days);
            clearError('workingDays');
          }}
        />
        {errors.workingDays && (
          <ThemedView style={styles.errorContainer}>
            <Icon
              name="warning-outline"
              type="ionicon"
              size={16}
              color="#FF6B6B"
            />
            <ThemedText style={styles.errorText}>{errors.workingDays}</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );

  const renderActions = () => (
    <ThemedView style={styles.actionsSection}>
      <Button
        title="Cancel"
        type="outline"
        onPress={() => router.back()}
        disabled={isLoading}
        icon={
          <Icon
            name="close-outline"
            type="ionicon"
            size={18}
            color={theme.colors.text}
            style={{ marginRight: spacing.sm }}
          />
        }
        buttonStyle={[
          styles.cancelButton,
          { borderColor: theme.colors.text + '30' }
        ]}
        titleStyle={[
          styles.cancelButtonText,
          { color: theme.colors.text }
        ]}
        containerStyle={styles.cancelButtonContainer}
      />

      <Button
        title={isLoading ? 'Adding...' : 'Add House Help'}
        onPress={handleSave}
        disabled={isLoading}
        loading={isLoading}
        icon={
          !isLoading && (
            <Icon
              name="checkmark-outline"
              type="ionicon"
              size={18}
              color="#FFFFFF"
              style={{ marginRight: spacing.sm }}
            />
          )
        }
        buttonStyle={[
          styles.saveButton,
          { backgroundColor: theme.colors.primary }
        ]}
        titleStyle={styles.saveButtonText}
        containerStyle={styles.saveButtonContainer}
      />
    </ThemedView>
  );

  return (
    <SafeAreaWrapper>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {renderHeader()}
          {renderForm()}
          {renderActions()}
        </Animated.View>
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
  container: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerContent: {
    marginBottom: spacing.lg,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  title: {
    ...typography.title1,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subhead,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
  },
  formSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.headline,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  formCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  inputWrapper: {
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
  currencySymbol: {
    ...typography.body,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  errorText: {
    color: '#FF6B6B',
    ...typography.caption1,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  helperText: {
    ...typography.caption1,
    fontStyle: 'italic',
    flex: 1,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  previewText: {
    ...typography.subhead,
    fontWeight: '600',
  },
  workingDaysLabel: {
    ...typography.subhead,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  cancelButtonContainer: {
    flex: 1,
  },
  cancelButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    ...shadows.sm,
  },
  cancelButtonText: {
    ...typography.headline,
    fontWeight: '600',
  },
  saveButtonContainer: {
    flex: 2,
  },
  saveButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    ...shadows.md,
  },
  saveButtonText: {
    color: '#FFFFFF',
    ...typography.headline,
    fontWeight: '600',
  },
});

export default AddHouseHelpScreen;

