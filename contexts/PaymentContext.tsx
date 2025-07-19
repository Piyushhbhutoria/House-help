import {
  addPayment as dbAddPayment,
  deletePayment as dbDeletePayment,
  updatePayment as dbUpdatePayment,
  getPayments
} from '@/utils/database';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface Payment {
  id: string;
  houseHelpId: string;
  amount: number;
  type: 'advance' | 'holiday' | 'overtime' | 'adjustment' | 'salary';
  date: string;
  description: string;
}

interface PaymentContextType {
  payments: Payment[];
  loading: boolean;
  addPayment: (payment: Omit<Payment, 'id'>) => Promise<void>;
  updatePayment: (id: string, payment: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  getPaymentsForHouseHelp: (houseHelpId: string, startDate: string, endDate: string) => Payment[];
  refreshPayments: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      console.log('Loading payments...');
      const loadedPayments = await getPayments();
      console.log('Loaded payments:', loadedPayments);
      setPayments(loadedPayments);
    } catch (error) {
      console.error('Failed to load payments:', error);
      setPayments([]); // Set to empty array in case of error
    } finally {
      setLoading(false);
    }
  };

  const addPayment = async (payment: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString()
    };
    try {
      await dbAddPayment(newPayment);
      setPayments(prev => [...prev, newPayment]);
    } catch (error) {
      console.error('Failed to add payment:', error);
      throw error;
    }
  };

  const updatePayment = async (id: string, payment: Partial<Payment>) => {
    try {
      await dbUpdatePayment(id, payment);
      setPayments(prev => prev.map(p => p.id === id ? { ...p, ...payment } : p));
    } catch (error) {
      console.error('Failed to update payment:', error);
      throw error;
    }
  };

  const deletePayment = async (id: string) => {
    try {
      await dbDeletePayment(id);
      setPayments(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete payment:', error);
      throw error;
    }
  };

  const getPaymentsForHouseHelp = (houseHelpId: string, startDate: string, endDate: string) => {
    return payments.filter(p =>
      p.houseHelpId === houseHelpId &&
      p.date >= startDate &&
      p.date <= endDate
    );
  };

  const refreshPayments = async () => {
    await loadPayments();
  };

  return (
    <PaymentContext.Provider value={{
      payments,
      loading,
      addPayment,
      updatePayment,
      deletePayment,
      getPaymentsForHouseHelp,
      refreshPayments,
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
