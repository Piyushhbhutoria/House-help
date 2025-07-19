import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAttendance } from '@/contexts/AttendanceContext';
import { HouseHelp, useHouseHelp } from '@/contexts/HouseHelpContext';
import { usePayment } from '@/contexts/PaymentContext';
import { useSettings } from '@/contexts/SettingsContext';
import { formatCurrency } from '@/utils/currency';
import { borderRadius, shadows, spacing, typography } from '@/utils/spacing';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Button, Divider, Icon } from 'react-native-elements';

interface SalaryInfo {
  totalSalary: number;
}

interface TotalSalaryInfo {
  baseSalary: number;
  holidayPay: number;
  overtime: number;
  advances: number;
  adjustments: number;
  totalSalary: number;
}

const SalaryScreen: React.FC = () => {
  const { houseHelps } = useHouseHelp();
  const { calculateSalary } = useAttendance();
  const { getPaymentsForHouseHelp } = usePayment();
  const { settings } = useSettings();
  const theme = useTheme();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const updateDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthString = month.toString().padStart(2, '0');
    const lastDay = new Date(year, month, 0).getDate();

    setStartDate(`${year}-${monthString}-01`);
    setEndDate(`${year}-${monthString}-${lastDay}`);
  };

  useEffect(() => {
    updateDates(selectedDate);
  }, [selectedDate]);

  const goToPreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    const currentDate = new Date();
    if (newDate <= currentDate) {
      setSelectedDate(newDate);
    }
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const calculateTotalSalary = (houseHelp: HouseHelp, salaryInfo: SalaryInfo):
    TotalSalaryInfo => {
    const payments = getPaymentsForHouseHelp(houseHelp.id, startDate, endDate);

    const baseSalary = salaryInfo.totalSalary;
    const holidayPay = payments
      .filter(p => p.type === 'holiday')
      .reduce((sum, p) => sum + p.amount, 0);
    const overtime = payments
      .filter(p => p.type === 'overtime')
      .reduce((sum, p) => sum + p.amount, 0);
    const advances = payments
      .filter(p => p.type === 'advance')
      .reduce((sum, p) => sum + p.amount, 0);
    const adjustments = payments
      .filter(p => p.type === 'adjustment')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      baseSalary,
      holidayPay,
      overtime,
      advances,
      adjustments,
      totalSalary: baseSalary + holidayPay + overtime - advances + adjustments
    };
  };

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerContent}>
        <ThemedView style={styles.titleSection}>
          <ThemedText style={[styles.title, { color: theme.colors.text }]}>
            Salary Information
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.colors.text }]}>
            Monthly salary calculations and payments
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderMonthSelector = () => (
    <ThemedView style={styles.monthSelectorCard}>
      <ThemedView style={styles.monthSelector}>
        <Button
          icon={
            <Icon
              name="chevron-back"
              type="ionicon"
              size={20}
              color={theme.colors.text}
            />
          }
          onPress={goToPreviousMonth}
          buttonStyle={[styles.navButton, { backgroundColor: 'transparent' }]}
          containerStyle={styles.navButtonContainer}
        />

        <ThemedView style={styles.monthDisplay}>
          <Icon
            name="calendar-outline"
            type="ionicon"
            size={20}
            color={theme.colors.primary}
            style={styles.monthIcon}
          />
          <ThemedText style={[styles.monthText, { color: theme.colors.text }]}>
            {formatMonthYear(selectedDate)}
          </ThemedText>
        </ThemedView>

        <Button
          icon={
            <Icon
              name="chevron-forward"
              type="ionicon"
              size={20}
              color={selectedDate.getMonth() === new Date().getMonth()
                ? theme.colors.text + '50'
                : theme.colors.text
              }
            />
          }
          onPress={goToNextMonth}
          disabled={selectedDate.getMonth() === new Date().getMonth()}
          buttonStyle={[styles.navButton, { backgroundColor: 'transparent' }]}
          containerStyle={styles.navButtonContainer}
        />
      </ThemedView>
    </ThemedView>
  );

  const renderSalaryItem = ({ item: houseHelp }: { item: HouseHelp }) => {
    const salaryInfo = calculateSalary(houseHelp, startDate, endDate);
    const totalSalaryInfo = calculateTotalSalary(houseHelp, salaryInfo);

    return (
      <ThemedView style={styles.salaryCard}>
        {/* Header with name and avatar */}
        <ThemedView style={styles.salaryHeader}>
          <ThemedView style={styles.nameSection}>
            <ThemedView style={[styles.avatarContainer, { backgroundColor: theme.colors.primary + '20' }]}>
              <Icon
                name="person"
                type="ionicon"
                size={18}
                color={theme.colors.primary}
              />
            </ThemedView>
            <ThemedText style={[styles.helperName, { color: theme.colors.text }]}>
              {houseHelp.name}
            </ThemedText>
          </ThemedView>
          <ThemedText style={[styles.totalAmount, { color: theme.colors.primary }]}>
            {formatCurrency(totalSalaryInfo.totalSalary, settings)}
          </ThemedText>
        </ThemedView>

        <Divider style={{ marginVertical: spacing.md }} />

        {/* Salary breakdown */}
        <ThemedView style={styles.salaryBreakdown}>
          <ThemedView style={styles.breakdownItem}>
            <ThemedText style={[styles.breakdownLabel, { color: theme.colors.text }]}>
              Base Salary
            </ThemedText>
            <ThemedText style={[styles.breakdownValue, { color: theme.colors.text }]}>
              {formatCurrency(totalSalaryInfo.baseSalary, settings)}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.breakdownItem}>
            <ThemedText style={[styles.breakdownLabel, { color: theme.colors.text }]}>
              Holiday Pay
            </ThemedText>
            <ThemedText style={[styles.breakdownValue, { color: theme.colors.text }]}>
              {formatCurrency(totalSalaryInfo.holidayPay, settings)}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.breakdownItem}>
            <ThemedText style={[styles.breakdownLabel, { color: theme.colors.text }]}>
              Overtime
            </ThemedText>
            <ThemedText style={[styles.breakdownValue, { color: theme.colors.text }]}>
              {formatCurrency(totalSalaryInfo.overtime, settings)}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.breakdownItem}>
            <ThemedText style={[styles.breakdownLabel, { color: theme.colors.text }]}>
              Advances
            </ThemedText>
            <ThemedText style={[styles.breakdownValue, { color: theme.colors.text + '80' }]}>
              -{formatCurrency(totalSalaryInfo.advances, settings)}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.breakdownItem}>
            <ThemedText style={[styles.breakdownLabel, { color: theme.colors.text }]}>
              Adjustments
            </ThemedText>
            <ThemedText style={[styles.breakdownValue, { color: theme.colors.text }]}>
              {formatCurrency(totalSalaryInfo.adjustments, settings)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };

  const renderEmptyState = () => (
    <ThemedView style={styles.emptyContainer}>
      <Icon
        name="cash-outline"
        type="ionicon"
        size={64}
        color={theme.colors.text + '40'}
        style={styles.emptyIcon}
      />
      <ThemedText style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No House Help Added
      </ThemedText>
      <ThemedText style={[styles.emptyText, { color: theme.colors.text }]}>
        Add house helpers first to view their salary information and calculations.
      </ThemedText>
    </ThemedView>
  );

  return (
    <SafeAreaWrapper>
      <ThemedView style={styles.container}>
        <FlatList
          data={houseHelps}
          keyExtractor={(item) => item.id}
          renderItem={renderSalaryItem}
          ListHeaderComponent={
            <ThemedView>
              {renderHeader()}
              {renderMonthSelector()}
            </ThemedView>
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
        />
      </ThemedView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
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
  monthSelectorCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  monthIcon: {
    marginRight: spacing.sm,
  },
  monthText: {
    ...typography.headline,
    fontWeight: '600',
  },
  navButtonContainer: {
    width: 40,
    height: 40,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 0,
  },
  separator: {
    height: spacing.md,
  },
  salaryCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  salaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  helperName: {
    ...typography.headline,
    fontWeight: '600',
  },
  totalAmount: {
    ...typography.title2,
    fontWeight: '700',
  },
  salaryBreakdown: {
    marginTop: spacing.xs,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  breakdownLabel: {
    ...typography.subhead,
    opacity: 0.8,
  },
  breakdownValue: {
    ...typography.subhead,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    ...typography.title2,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
});

export default SalaryScreen;
