import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { useAttendance } from '@/contexts/AttendanceContext';
import { usePayment } from '@/contexts/PaymentContext';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
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

  const renderSalaryItem = ({ item: houseHelp }: { item: HouseHelp }) => {
    const salaryInfo = calculateSalary(houseHelp, startDate, endDate);
    const totalSalaryInfo = calculateTotalSalary(houseHelp, salaryInfo);

    return (
      <ThemedView style={styles.salaryItem} backgroundColor="secondary">
        <ThemedText type="subtitle">{houseHelp.name}</ThemedText>
        <View style={styles.salaryDetails}>
          <ThemedText>Base Salary: ₹{totalSalaryInfo.baseSalary.toFixed(2)}</ThemedText>
          <ThemedText>Holiday Pay: ₹{totalSalaryInfo.holidayPay.toFixed(2)}</ThemedText>
          <ThemedText>Overtime: ₹{totalSalaryInfo.overtime.toFixed(2)}</ThemedText>
          <ThemedText>Advances: ₹{totalSalaryInfo.advances.toFixed(2)}</ThemedText>
          <ThemedText>Adjustments: ₹{totalSalaryInfo.adjustments.toFixed(2)}</ThemedText>
          <ThemedText type="subtitle" style={styles.totalSalary}>
            Final Salary: ₹{totalSalaryInfo.totalSalary.toFixed(2)}
          </ThemedText>
        </View>
      </ThemedView>
    );
  };

  return (
    <SafeAreaWrapper>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Salary Information</ThemedText>
        
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <ThemedText type="subtitle" style={styles.monthText}>
            {formatMonthYear(selectedDate)}
          </ThemedText>
          
          <TouchableOpacity 
            onPress={goToNextMonth}
            disabled={selectedDate.getMonth() === new Date().getMonth()}
          >
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={selectedDate.getMonth() === new Date().getMonth() 
                ? theme.colors.text + '50' 
                : theme.colors.text
              } 
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={houseHelps}
          keyExtractor={(item) => item.id}
          renderItem={renderSalaryItem}
          ListEmptyComponent={
            <ThemedView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No house helps added yet.</ThemedText>
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
    marginBottom: 8,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  monthText: {
    textAlign: 'center',
  },
  salaryItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  salaryDetails: {
    marginTop: 8,
  },
  totalSalary: {
    marginTop: 8,
    borderTopWidth: 1,
    paddingTop: 8,
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

export default SalaryScreen;
