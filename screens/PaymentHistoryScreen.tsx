import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { usePayment } from '@/contexts/PaymentContext';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { useTheme } from '@react-navigation/native';

interface Payment {
  id: string;
  houseHelpId: string;
  amount: number;
  type: string;
  date: string;
  description?: string;
}

const PaymentHistoryScreen: React.FC = () => {
  const { payments } = usePayment();
  const { houseHelps } = useHouseHelp();
  const theme = useTheme();
  
  const getHouseHelpName = (id: string) => {
    const houseHelp = houseHelps.find(hh => hh.id === id);
    return houseHelp?.name || 'Unknown';
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <ThemedView style={styles.paymentItem} backgroundColor="secondary">
      <View style={styles.paymentHeader}>
        <ThemedText type="subtitle">{getHouseHelpName(item.houseHelpId)}</ThemedText>
        <ThemedText style={[
          styles.paymentType,
          { color: theme.colors.primary }
        ]}>
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </ThemedText>
      </View>
      <View style={styles.paymentDetails}>
        <ThemedText>Amount: ₹{item.amount.toFixed(2)}</ThemedText>
        <ThemedText>Date: {new Date(item.date).toLocaleDateString()}</ThemedText>
        {item.description && (
          <ThemedText style={styles.description}>{item.description}</ThemedText>
        )}
      </View>
    </ThemedView>
  );

  return (
    <SafeAreaWrapper>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Payment History</ThemedText>
        <FlatList
          data={[...payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
          keyExtractor={(item) => item.id}
          renderItem={renderPaymentItem}
          ListEmptyComponent={
            <ThemedView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No payment history available.</ThemedText>
            </ThemedView>
          }
        />
      </ThemedView>
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
  paymentItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentType: {
    fontWeight: '600',
  },
  paymentDetails: {
    marginTop: 4,
  },
  description: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});

export default PaymentHistoryScreen;
