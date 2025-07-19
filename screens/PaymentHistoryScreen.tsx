import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { usePayment } from '@/contexts/PaymentContext';
import { useSettings } from '@/contexts/SettingsContext';
import { formatCurrency } from '@/utils/currency';
import { borderRadius, shadows, spacing, typography } from '@/utils/spacing';
import { useTheme } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet } from 'react-native';
import { Button, Divider, Icon } from 'react-native-elements';

interface Payment {
  id: string;
  houseHelpId: string;
  amount: number;
  type: string;
  date: string;
  description?: string;
}

const PaymentHistoryScreen: React.FC = () => {
  const { payments, loading, deletePayment } = usePayment();
  const { houseHelps } = useHouseHelp();
  const { settings } = useSettings();
  const theme = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const getHouseHelpName = (id: string) => {
    const houseHelp = houseHelps.find(hh => hh.id === id);
    return houseHelp?.name || 'Unknown';
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

  const filteredPayments = useMemo(() => {
    const sortedPayments = [...payments].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (selectedFilter === 'all') return sortedPayments;
    return sortedPayments.filter(payment => payment.type === selectedFilter);
  }, [payments, selectedFilter]);

  const totalAmount = useMemo(() => {
    return filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  }, [filteredPayments]);

  const handleDeletePayment = async (payment: Payment) => {
    const executeDelete = async () => {
      try {
        await deletePayment(payment.id);
      } catch (error) {
        console.error('Error deleting payment:', error);
        Alert.alert('Error', 'Failed to delete payment. Please try again.');
      }
    };

    // Check if confirmation is required
    if (settings.confirmDeletions) {
      Alert.alert(
        'Delete Payment',
        `Are you sure you want to delete this ${payment.type} payment of ${formatCurrency(payment.amount, settings)}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: executeDelete
          }
        ]
      );
    } else {
      await executeDelete();
    }
  };

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerContent}>
        <ThemedView style={styles.titleSection}>
          <ThemedText style={[styles.title, { color: theme.colors.text }]}>
            Payment History
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.colors.text }]}>
            Track all payments and adjustments
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderSummary = () => (
    <ThemedView style={styles.summarySection}>
      <ThemedView style={styles.summaryCard}>
        <ThemedView style={styles.summaryContent}>
          <ThemedView style={styles.summaryItem}>
            <ThemedText style={[styles.summaryLabel, { color: theme.colors.text }]}>
              Total Payments
            </ThemedText>
            <ThemedText style={[styles.summaryValue, { color: theme.colors.text }]}>
              {filteredPayments.length}
            </ThemedText>
          </ThemedView>
          <Divider orientation="vertical" width={1} color={theme.colors.text + '20'} />
          <ThemedView style={styles.summaryItem}>
            <ThemedText style={[styles.summaryLabel, { color: theme.colors.text }]}>
              Total Amount
            </ThemedText>
            <ThemedText style={[styles.summaryValue, { color: theme.colors.primary }]}>
              {formatCurrency(totalAmount, settings)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderFilterButtons = () => (
    <ThemedView style={styles.filterSection}>
      <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Filter by Type
      </ThemedText>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[
          { key: 'all', label: 'All', icon: 'list-outline' },
          { key: 'advance', label: 'Advance', icon: 'cash-outline' },
          { key: 'holiday', label: 'Holiday', icon: 'calendar-outline' },
          { key: 'overtime', label: 'Overtime', icon: 'time-outline' },
          { key: 'adjustment', label: 'Adjustment', icon: 'calculator-outline' },
        ]}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Button
            title={item.label}
            onPress={() => setSelectedFilter(item.key)}
            icon={
              <Icon
                name={item.icon}
                type="ionicon"
                size={16}
                color={selectedFilter === item.key ? '#FFFFFF' : getTypeColor(item.key)}
                style={{ marginRight: spacing.xs }}
              />
            }
            buttonStyle={[
              styles.filterButton,
              {
                backgroundColor: selectedFilter === item.key
                  ? getTypeColor(item.key)
                  : getTypeColor(item.key) + '20',
                borderColor: getTypeColor(item.key),
              }
            ]}
            titleStyle={[
              styles.filterButtonText,
              {
                color: selectedFilter === item.key
                  ? '#FFFFFF'
                  : getTypeColor(item.key)
              }
            ]}
            containerStyle={styles.filterButtonContainer}
          />
        )}
      />
    </ThemedView>
  );

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <ThemedView style={styles.paymentCard}>
      <ThemedView style={styles.paymentHeader}>
        <ThemedView style={styles.paymentInfo}>
          <ThemedView style={styles.paymentTitleRow}>
            <ThemedText style={[styles.paymentTitle, { color: theme.colors.text }]}>
              {getHouseHelpName(item.houseHelpId)}
            </ThemedText>
            <ThemedView style={[
              styles.paymentBadge,
              { backgroundColor: getTypeColor(item.type) }
            ]}>
              <ThemedText style={[
                styles.paymentBadgeText,
                { color: '#FFFFFF' }
              ]}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedText style={[styles.paymentDate, { color: theme.colors.text + '70' }]}>
            {new Date(item.date).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.paymentAmount}>
          <ThemedText style={[styles.amountText, { color: theme.colors.primary }]}>
            {formatCurrency(item.amount, settings)}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {item.description && (
        <ThemedView style={styles.descriptionContainer}>
          <Icon
            name="document-text-outline"
            type="ionicon"
            size={16}
            color={theme.colors.text + '50'}
            style={styles.descriptionIcon}
          />
          <ThemedText style={[styles.descriptionText, { color: theme.colors.text + '80' }]}>
            {item.description}
          </ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.paymentActions}>
        <Button
          icon={
            <Icon
              name="trash-outline"
              type="ionicon"
              size={18}
              color="#FF6B6B"
            />
          }
          onPress={() => handleDeletePayment(item)}
          buttonStyle={styles.deleteButton}
          containerStyle={styles.deleteButtonContainer}
        />
      </ThemedView>
    </ThemedView>
  );

  const renderEmptyState = () => (
    <ThemedView style={styles.emptyContainer}>
      <Icon
        name="receipt-outline"
        type="ionicon"
        size={64}
        color={theme.colors.text + '30'}
        style={styles.emptyIcon}
      />
      <ThemedText style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No Payments Found
      </ThemedText>
      <ThemedText style={[styles.emptyText, { color: theme.colors.text + '70' }]}>
        {selectedFilter === 'all'
          ? 'Start by adding your first payment or adjustment.'
          : `No ${selectedFilter} payments found. Try a different filter.`
        }
      </ThemedText>
    </ThemedView>
  );

  const renderLoadingState = () => (
    <ThemedView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <ThemedText style={[styles.loadingText, { color: theme.colors.text + '70' }]}>
        Loading payment history...
      </ThemedText>
    </ThemedView>
  );

  if (loading) {
    return (
      <SafeAreaWrapper>
        <ThemedView style={styles.container}>
          {renderHeader()}
          {renderLoadingState()}
        </ThemedView>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <ThemedView style={styles.container}>
        <FlatList
          data={filteredPayments}
          keyExtractor={(item) => item.id}
          renderItem={renderPaymentItem}
          ListHeaderComponent={
            <ThemedView>
              {renderHeader()}
              {renderSummary()}
              {renderFilterButtons()}
            </ThemedView>
          }
          ListEmptyComponent={renderEmptyState()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </ThemedView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
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
  summarySection: {
    marginBottom: spacing.xl,
  },
  summaryCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 0,
    padding: spacing.lg,
    ...shadows.sm,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    ...typography.footnote,
    marginBottom: spacing.xs,
    opacity: 0.7,
  },
  summaryValue: {
    ...typography.title2,
    fontWeight: '700',
  },
  filterSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.headline,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  filterButtonContainer: {
    marginRight: spacing.sm,
  },
  filterButton: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    ...shadows.sm,
  },
  filterButtonText: {
    ...typography.subhead,
    fontWeight: '600',
  },
  paymentCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 0,
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadows.sm,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  paymentInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  paymentTitle: {
    ...typography.headline,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  paymentBadge: {
    borderRadius: borderRadius.sm,
  },
  paymentBadgeText: {
    ...typography.caption1,
    fontWeight: '600',
    padding: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  paymentDate: {
    ...typography.footnote,
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    ...typography.title3,
    fontWeight: '700',
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  descriptionIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  descriptionText: {
    ...typography.body,
    flex: 1,
    fontStyle: 'italic',
  },
  paymentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: spacing.sm,
  },
  deleteButtonContainer: {
    marginLeft: spacing.sm,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.title2,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  loadingText: {
    ...typography.body,
    marginTop: spacing.lg,
  },
});

export default PaymentHistoryScreen;
