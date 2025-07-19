import { HouseHelp } from '@/contexts/HouseHelpContext';
import { useSettings } from '@/contexts/SettingsContext';
import { formatCurrency } from '@/utils/currency';
import { borderRadius, shadows, spacing, typography } from '@/utils/spacing';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface HouseHelpItemProps {
  houseHelp: HouseHelp;
}

export const HouseHelpItem: React.FC<HouseHelpItemProps> = ({ houseHelp }) => {
  const router = useRouter();
  const { settings } = useSettings();
  const theme = useTheme();

  const handlePress = () => {
    router.push({
      pathname: '/edit-house-help',
      params: { houseHelpId: houseHelp.id }
    });
  };

  const getWorkingDaysText = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return houseHelp.workingDays
      .map(day => dayNames[day])
      .join(', ');
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <ThemedView style={[styles.container]}>
        {/* Header with name and chevron */}
        <ThemedView style={styles.header}>
          <ThemedView style={styles.nameSection}>
            <ThemedView style={[styles.avatarContainer, { backgroundColor: theme.colors.primary + '20' }]}>
              <Icon
                name="person"
                type="ionicon"
                size={18}
                color={theme.colors.primary}
              />
            </ThemedView>
            <ThemedView style={styles.nameContainer}>
              <ThemedText style={[styles.name, { color: theme.colors.text }]}>
                {houseHelp.name}
              </ThemedText>
              <ThemedText style={[styles.workingDays, { color: theme.colors.text + '70' }]}>
                {getWorkingDaysText()}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <Icon
            name="chevron-forward"
            type="ionicon"
            size={16}
            color={theme.colors.text + '40'}
          />
        </ThemedView>

        {/* Salary and details section */}
        <ThemedView style={styles.detailsSection}>
          <ThemedView style={styles.salaryRow}>
            <ThemedView style={styles.salaryItem}>
              <ThemedText style={[styles.salaryLabel, { color: theme.colors.text + '70' }]}>
                Monthly Salary
              </ThemedText>
              <ThemedText style={[styles.salaryValue, { color: theme.colors.text }]}>
                {formatCurrency(houseHelp.monthlySalary, settings)}
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.divider, { backgroundColor: theme.colors.text + '20' }]} />

            <ThemedView style={styles.salaryItem}>
              <ThemedText style={[styles.salaryLabel, { color: theme.colors.text + '70' }]}>
                Daily Wage
              </ThemedText>
              <ThemedText style={[styles.salaryValue, { color: theme.colors.text }]}>
                {formatCurrency(houseHelp.dailyWage, settings)}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={[styles.shiftsContainer, { borderTopColor: theme.colors.text + '10' }]}>
            <Icon
              name="time-outline"
              type="ionicon"
              size={14}
              color={theme.colors.text + '50'}
            />
            <ThemedText style={[styles.shiftsText, { color: theme.colors.text + '70' }]}>
              {houseHelp.shifts} shifts per day
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    ...typography.headline,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  workingDays: {
    ...typography.caption1,
  },
  detailsSection: {
    marginTop: spacing.xs,
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: spacing.md,
    minHeight: 60,
  },
  salaryItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  salaryLabel: {
    ...typography.caption1,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  salaryValue: {
    ...typography.subhead,
    fontWeight: '600',
    textAlign: 'center',
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginHorizontal: spacing.lg,
  },
  shiftsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  shiftsText: {
    ...typography.caption1,
    marginLeft: spacing.xs,
  },
});
