import { Attendance } from '@/contexts/AttendanceContext';
import { HouseHelp } from '@/contexts/HouseHelpContext';
import { Payment } from '@/contexts/PaymentContext';
import { Settings } from '@/contexts/SettingsContext';
import { formatCurrency } from './currency';

export interface AnalyticsData {
  totalHouseHelps: number;
  totalMonthlyCost: number;
  avgAttendanceRate: number;
  totalPayments: number;
  topPerformers: HouseHelp[];
  costTrends: CostTrendData[];
  attendanceTrends: AttendanceTrendData[];
  paymentBreakdown: PaymentBreakdown[];
}

export interface CostTrendData {
  month: string;
  amount: number;
  label: string;
}

export interface AttendanceTrendData {
  month: string;
  rate: number;
  total: number;
  present: number;
}

export interface PaymentBreakdown {
  type: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface WorkerMetrics {
  houseHelpId: string;
  name: string;
  attendanceRate: number;
  totalEarned: number;
  punctualityScore: number;
  efficiency: number;
}

export interface InsightData {
  id: string;
  type: 'cost' | 'attendance' | 'efficiency' | 'overtime';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  savings?: number;
}

/**
 * Calculate overall analytics data for dashboard
 */
export const calculateAnalytics = (
  houseHelps: HouseHelp[],
  attendances: Attendance[],
  payments: Payment[],
  months: number = 6
): AnalyticsData => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const relevantAttendances = attendances.filter(
    att => new Date(att.date) >= startDate && new Date(att.date) <= endDate
  );

  const relevantPayments = payments.filter(
    pay => new Date(pay.date) >= startDate && new Date(pay.date) <= endDate
  );

  const totalMonthlyCost = houseHelps.reduce((sum, help) => sum + help.monthlySalary, 0);
  const totalPayments = relevantPayments.reduce((sum, pay) => sum + pay.amount, 0);

  // Calculate attendance rate
  const totalPossibleAttendance = houseHelps.reduce((sum, help) => {
    const workerAttendances = relevantAttendances.filter(att => att.houseHelpId === help.id);
    const workingDaysInPeriod = calculateWorkingDaysInPeriod(help.workingDays, startDate, endDate);
    return sum + workingDaysInPeriod;
  }, 0);

  const totalActualAttendance = relevantAttendances.filter(att => att.status === 'present').length +
    (relevantAttendances.filter(att => att.status === 'half-day').length * 0.5);

  const avgAttendanceRate = totalPossibleAttendance > 0 ?
    (totalActualAttendance / totalPossibleAttendance) * 100 : 0;

  // Generate trends
  const costTrends = generateCostTrends(houseHelps, payments, months);
  const attendanceTrends = generateAttendanceTrends(houseHelps, attendances, months);
  const paymentBreakdown = generatePaymentBreakdown(relevantPayments);

  // Calculate top performers
  const topPerformers = calculateTopPerformers(houseHelps, relevantAttendances).slice(0, 3);

  return {
    totalHouseHelps: houseHelps.length,
    totalMonthlyCost,
    avgAttendanceRate,
    totalPayments,
    topPerformers,
    costTrends,
    attendanceTrends,
    paymentBreakdown,
  };
};

/**
 * Generate cost trends for charts
 */
export const generateCostTrends = (
  houseHelps: HouseHelp[],
  payments: Payment[],
  months: number = 6
): CostTrendData[] => {
  const trends: CostTrendData[] = [];
  const endDate = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(endDate);
    monthDate.setMonth(monthDate.getMonth() - i);

    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

    const monthPayments = payments.filter(
      pay => new Date(pay.date) >= monthStart && new Date(pay.date) <= monthEnd
    );

    const monthTotal = monthPayments.reduce((sum, pay) => sum + pay.amount, 0);

    trends.push({
      month: monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      amount: monthTotal,
      label: monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    });
  }

  return trends;
};

/**
 * Generate attendance trends for charts
 */
export const generateAttendanceTrends = (
  houseHelps: HouseHelp[],
  attendances: Attendance[],
  months: number = 6
): AttendanceTrendData[] => {
  const trends: AttendanceTrendData[] = [];
  const endDate = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(endDate);
    monthDate.setMonth(monthDate.getMonth() - i);

    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

    const monthAttendances = attendances.filter(
      att => new Date(att.date) >= monthStart && new Date(att.date) <= monthEnd
    );

    const presentCount = monthAttendances.filter(att => att.status === 'present').length +
      (monthAttendances.filter(att => att.status === 'half-day').length * 0.5);

    const totalExpected = houseHelps.reduce((sum, help) => {
      return sum + calculateWorkingDaysInPeriod(help.workingDays, monthStart, monthEnd);
    }, 0);

    const rate = totalExpected > 0 ? (presentCount / totalExpected) * 100 : 0;

    trends.push({
      month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
      rate: Math.round(rate * 100) / 100,
      total: totalExpected,
      present: Math.round(presentCount)
    });
  }

  return trends;
};

/**
 * Generate payment breakdown for pie chart
 */
export const generatePaymentBreakdown = (payments: Payment[]): PaymentBreakdown[] => {
  const breakdown = payments.reduce((acc, payment) => {
    acc[payment.type] = (acc[payment.type] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(breakdown).reduce((sum, amount) => sum + amount, 0);

  const colors = {
    salary: '#4CAF50',
    advance: '#FF9800',
    overtime: '#2196F3',
    holiday: '#9C27B0',
    adjustment: '#F44336'
  };

  return Object.entries(breakdown).map(([type, amount]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    amount,
    percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    color: colors[type as keyof typeof colors] || '#666'
  }));
};

/**
 * Calculate top performers based on attendance and efficiency
 */
export const calculateTopPerformers = (
  houseHelps: HouseHelp[],
  attendances: Attendance[]
): HouseHelp[] => {
  const performanceScores = houseHelps.map(help => {
    const workerAttendances = attendances.filter(att => att.houseHelpId === help.id);
    const presentDays = workerAttendances.filter(att => att.status === 'present').length;
    const halfDays = workerAttendances.filter(att => att.status === 'half-day').length;
    const totalDays = workerAttendances.length;

    const attendanceRate = totalDays > 0 ?
      ((presentDays + halfDays * 0.5) / totalDays) * 100 : 0;

    return {
      ...help,
      performanceScore: attendanceRate
    };
  });

  return performanceScores
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .map(({ performanceScore, ...help }) => help);
};

/**
 * Generate insights and recommendations
 */
export const generateInsights = (
  houseHelps: HouseHelp[],
  attendances: Attendance[],
  payments: Payment[],
  settings: Settings
): InsightData[] => {
  const insights: InsightData[] = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3); // Last 3 months

  const recentAttendances = attendances.filter(
    att => new Date(att.date) >= startDate && new Date(att.date) <= endDate
  );

  const recentPayments = payments.filter(
    pay => new Date(pay.date) >= startDate && new Date(pay.date) <= endDate
  );

  // Cost optimization insights
  const avgMonthlyCost = recentPayments.reduce((sum, pay) => sum + pay.amount, 0) / 3;
  const budgetedCost = houseHelps.reduce((sum, help) => sum + help.monthlySalary, 0);

  if (avgMonthlyCost > budgetedCost * 1.1) {
    insights.push({
      id: 'cost-overrun',
      type: 'cost',
      title: 'Budget Overrun Detected',
      description: `Actual spending is ${Math.round(((avgMonthlyCost - budgetedCost) / budgetedCost) * 100)}% above budget`,
      impact: 'high',
      recommendation: 'Review overtime and advance payments. Consider renegotiating rates.',
      savings: avgMonthlyCost - budgetedCost
    });
  }

  // Attendance pattern insights
  const lowAttendanceWorkers = houseHelps.filter(help => {
    const workerAttendances = recentAttendances.filter(att => att.houseHelpId === help.id);
    const presentDays = workerAttendances.filter(att => att.status === 'present').length;
    const totalDays = workerAttendances.length;
    return totalDays > 0 && (presentDays / totalDays) < 0.8;
  });

  if (lowAttendanceWorkers.length > 0) {
    insights.push({
      id: 'low-attendance',
      type: 'attendance',
      title: 'Low Attendance Alert',
      description: `${lowAttendanceWorkers.length} worker(s) have attendance below 80%`,
      impact: 'medium',
      recommendation: 'Schedule performance review meetings and discuss attendance expectations.'
    });
  }

  // High overtime usage insight
  const overtimePayments = payments.filter(p => p.type === 'overtime');
  if (overtimePayments.length > 5) {
    const overtimeTotal = overtimePayments.reduce((sum, pay) => sum + pay.amount, 0);
    insights.push({
      id: 'high-overtime',
      type: 'overtime',
      title: 'High Overtime Usage',
      description: `${overtimePayments.length} overtime payments totaling ${formatCurrency(overtimeTotal, settings)}`,
      impact: 'medium',
      recommendation: 'Consider hiring additional staff or redistributing workload.',
      savings: overtimeTotal * 0.3 // Estimated 30% savings
    });
  }

  // Efficiency insights
  const totalShiftsCompleted = recentAttendances.reduce((sum, att) => sum + att.shiftsCompleted, 0);
  const expectedShifts = recentAttendances.length * (houseHelps[0]?.shifts || 1);

  if (totalShiftsCompleted < expectedShifts * 0.9) {
    insights.push({
      id: 'low-efficiency',
      type: 'efficiency',
      title: 'Efficiency Below Target',
      description: `Only ${Math.round((totalShiftsCompleted / expectedShifts) * 100)}% of expected shifts completed`,
      impact: 'medium',
      recommendation: 'Review work processes and provide additional training if needed.'
    });
  }

  return insights;
};

/**
 * Calculate working days in a period based on worker's schedule
 */
export const calculateWorkingDaysInPeriod = (
  workingDays: number[],
  startDate: Date,
  endDate: Date
): number => {
  let count = 0;
  const current = new Date(startDate);

  while (current <= endDate) {
    if (workingDays.includes(current.getDay())) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
};

/**
 * Calculate worker performance metrics
 */
export const calculateWorkerMetrics = (
  houseHelps: HouseHelp[],
  attendances: Attendance[],
  payments: Payment[],
  months: number = 3
): WorkerMetrics[] => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return houseHelps.map(help => {
    const workerAttendances = attendances.filter(
      att => att.houseHelpId === help.id &&
        new Date(att.date) >= startDate &&
        new Date(att.date) <= endDate
    );

    const workerPayments = payments.filter(
      pay => pay.houseHelpId === help.id &&
        new Date(pay.date) >= startDate &&
        new Date(pay.date) <= endDate
    );

    const presentDays = workerAttendances.filter(att => att.status === 'present').length;
    const halfDays = workerAttendances.filter(att => att.status === 'half-day').length;
    const totalDays = workerAttendances.length;
    const expectedDays = calculateWorkingDaysInPeriod(help.workingDays, startDate, endDate);

    const attendanceRate = expectedDays > 0 ?
      ((presentDays + halfDays * 0.5) / expectedDays) * 100 : 0;

    const totalEarned = workerPayments.reduce((sum, pay) => sum + pay.amount, 0);

    // Simple punctuality score based on shift completion
    const totalShifts = workerAttendances.reduce((sum, att) => sum + att.shiftsCompleted, 0);
    const expectedShifts = presentDays * help.shifts;
    const punctualityScore = expectedShifts > 0 ?
      Math.min((totalShifts / expectedShifts) * 100, 100) : 0;

    // Efficiency based on attendance consistency
    const efficiency = attendanceRate > 90 ? 100 : attendanceRate > 80 ? 85 : attendanceRate > 70 ? 70 : 50;

    return {
      houseHelpId: help.id,
      name: help.name,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      totalEarned,
      punctualityScore: Math.round(punctualityScore * 100) / 100,
      efficiency
    };
  });
}; 
