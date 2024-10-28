import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Payment {
  id: string;
  houseHelpId: string;
  amount: number;
  type: 'advance' | 'holiday' | 'overtime' | 'adjustment' | 'salary';
  date: string;
  description: string;
}

interface PaymentContextType {
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  getPaymentsForHouseHelp: (houseHelpId: string, startDate: string, endDate: string) => Payment[];
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<Payment[]>([]);

  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment = { ...payment, id: Date.now().toString() };
    setPayments(prev => [...prev, newPayment]);
  };

  const updatePayment = (id: string, payment: Partial<Payment>) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, ...payment } : p));
  };

  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  const getPaymentsForHouseHelp = (houseHelpId: string, startDate: string, endDate: string) => {
    return payments.filter(p => 
      p.houseHelpId === houseHelpId && 
      p.date >= startDate && 
      p.date <= endDate
    );
  };

  return (
    <PaymentContext.Provider value={{
      payments,
      addPayment,
      updatePayment,
      deletePayment,
      getPaymentsForHouseHelp,
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
