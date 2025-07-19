import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAttendance } from '@/contexts/AttendanceContext';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { usePayment } from '@/contexts/PaymentContext';
import { useSettings } from '@/contexts/SettingsContext';
import {
  AnalyticsData,
  calculateAnalytics,
  calculateWorkerMetrics,
  WorkerMetrics,
} from '@/utils/analytics';
import { formatCurrency } from '@/utils/currency';
import { borderRadius, shadows, spacing, typography } from '@/utils/spacing';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import {
  Icon
} from 'react-native-elements';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 64; // Adjusted for new padding

type TimeRange = '1M' | '3M' | '6M' | '1Y';

export const ReportsScreen: React.FC = () => {
  const theme = useTheme();
  const { houseHelps } = useHouseHelp();
  const { attendances } = useAttendance();
  const { payments } = usePayment();
  const { settings } = useSettings();

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [workerMetrics, setWorkerMetrics] = useState<WorkerMetrics[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('6M');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const chartConfig = {
    backgroundColor: theme.colors.background,
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${theme.dark ? '208, 244, 216' : '46, 61, 89'}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${theme.dark ? '208, 244, 216' : '46, 61, 89'}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.colors.border,
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: '500',
    },
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [houseHelps, attendances, payments, selectedTimeRange]);

  const loadAnalyticsData = async () => {
    if (houseHelps.length === 0) {
      setAnalyticsData(null);
      setWorkerMetrics([]);
      setIsLoading(false);
      return;
    }

    try {
      const months = getMonthsForTimeRange(selectedTimeRange);
      const analytics = calculateAnalytics(houseHelps, attendances, payments, months);
      const metrics = calculateWorkerMetrics(houseHelps, attendances, payments, months);

      setAnalyticsData(analytics);
      setWorkerMetrics(metrics);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      Alert.alert('Error', 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadAnalyticsData();
    setIsRefreshing(false);
  };

  const getMonthsForTimeRange = (range: TimeRange): number => {
    switch (range) {
      case '1M': return 1;
      case '3M': return 3;
      case '6M': return 6;
      case '1Y': return 12;
      default: return 6;
    }
  };

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerContent}>
        <ThemedView style={styles.titleSection}>
          <ThemedView style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <Icon
              name="bar-chart"
              type="ionicon"
              size={24}
              color="#FFFFFF"
            />
          </ThemedView>
          <ThemedText style={[styles.title, { color: theme.colors.text }]}>
            Analytics Dashboard
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.colors.text }]}>
            Insights and trends for your house help management
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderTimeRangeSelector = () => (
    <ThemedView style={styles.timeRangeSection}>
      <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Time Range
      </ThemedText>
      <ThemedView style={styles.timeRangeContainer}>
        {(['1M', '3M', '6M', '1Y'] as TimeRange[]).map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.timeRangeButton,
              {
                backgroundColor: selectedTimeRange === range ? theme.colors.primary : 'transparent',
                borderColor: selectedTimeRange === range ? theme.colors.primary : theme.colors.text + '30',
              },
            ]}
            onPress={() => setSelectedTimeRange(range)}
          >
            <ThemedText
              style={[
                styles.timeRangeText,
                {
                  color: selectedTimeRange === range ? '#FFFFFF' : theme.colors.text,
                  fontWeight: selectedTimeRange === range ? '600' : '500'
                },
              ]}
            >
              {range}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ThemedView>
  );

  const renderStatsCards = () => {
    if (!analyticsData) return null;

    const stats = [
      {
        title: 'Total Workers',
        value: analyticsData.totalHouseHelps.toString(),
        icon: 'people-outline',
        color: theme.colors.primary,
      },
      {
        title: 'Monthly Budget',
        value: formatCurrency(analyticsData.totalMonthlyCost, settings),
        icon: 'wallet-outline',
        color: '#4CAF50',
      },
      {
        title: 'Attendance Rate',
        value: `${analyticsData.avgAttendanceRate.toFixed(1)}%`,
        icon: 'trending-up-outline',
        color: analyticsData.avgAttendanceRate >= 80 ? '#4CAF50' : analyticsData.avgAttendanceRate >= 60 ? '#FF9800' : '#F44336',
      },
      {
        title: 'Total Payments',
        value: formatCurrency(analyticsData.totalPayments, settings),
        icon: 'card-outline',
        color: '#2196F3',
      },
    ];

    return (
      <ThemedView style={styles.statsSection}>
        <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Key Metrics
        </ThemedText>
        <ThemedView style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <ThemedView key={index} style={[styles.statCard]}>
              <ThemedView style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Icon
                  name={stat.icon}
                  type="ionicon"
                  size={20}
                  color={stat.color}
                />
              </ThemedView>
              <ThemedText style={[styles.statTitle, { color: theme.colors.text + '70' }]}>
                {stat.title}
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: theme.colors.text }]}>
                {stat.value}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>
    );
  };

  const renderCostTrends = () => {
    if (!analyticsData || analyticsData.costTrends.length === 0) return null;

    const data = {
      labels: analyticsData.costTrends.map(trend => trend.label),
      datasets: [{
        data: analyticsData.costTrends.map(trend => trend.amount),
        color: (opacity = 1) => `rgba(${theme.dark ? '161, 228, 182' : '109, 178, 143'}, ${opacity})`,
        strokeWidth: 2,
      }],
    };

    return (
      <ThemedView style={styles.chartSection}>
        <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Cost Trends
        </ThemedText>
        <ThemedView style={[styles.chartCard]}>
          <ThemedView style={styles.chartHeader}>
            <Icon
              name="trending-up-outline"
              type="ionicon"
              size={20}
              color={theme.colors.primary}
            />
            <ThemedText style={[styles.chartTitle, { color: theme.colors.text }]}>
              Monthly Cost Analysis ({selectedTimeRange})
            </ThemedText>
          </ThemedView>
          <LineChart
            data={data}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </ThemedView>
      </ThemedView>
    );
  };

  const renderAttendanceTrends = () => {
    if (!analyticsData || analyticsData.attendanceTrends.length === 0) return null;

    const data = {
      labels: analyticsData.attendanceTrends.map(trend => trend.month),
      datasets: [{
        data: analyticsData.attendanceTrends.map(trend => trend.rate),
      }],
    };

    return (
      <ThemedView style={styles.chartSection}>
        <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Attendance Trends
        </ThemedText>
        <ThemedView style={[styles.chartCard]}>
          <ThemedView style={styles.chartHeader}>
            <Icon
              name="bar-chart-outline"
              type="ionicon"
              size={20}
              color={theme.colors.primary}
            />
            <ThemedText style={[styles.chartTitle, { color: theme.colors.text }]}>
              Monthly Attendance Rate ({selectedTimeRange})
            </ThemedText>
          </ThemedView>
          <BarChart
            data={data}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix="%"
          />
        </ThemedView>
      </ThemedView>
    );
  };

  const renderPaymentBreakdown = () => {
    if (!analyticsData || analyticsData.paymentBreakdown.length === 0) return null;

    const data = analyticsData.paymentBreakdown.map((item, index) => ({
      name: item.type,
      amount: item.amount,
      color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][index % 5],
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    }));

    return (
      <ThemedView style={styles.chartSection}>
        <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Payment Breakdown
        </ThemedText>
        <ThemedView style={[styles.chartCard]}>
          <ThemedView style={styles.chartHeader}>
            <Icon
              name="pie-chart-outline"
              type="ionicon"
              size={20}
              color={theme.colors.primary}
            />
            <ThemedText style={[styles.chartTitle, { color: theme.colors.text }]}>
              Payment Distribution
            </ThemedText>
          </ThemedView>
          <PieChart
            data={data}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
          <ThemedView style={styles.legendContainer}>
            {data.map((item, index) => (
              <ThemedView key={index} style={styles.legendItem}>
                <ThemedView style={[styles.legendColor, { backgroundColor: item.color }]} />
                <ThemedText style={[styles.legendText, { color: theme.colors.text }]}>
                  {item.name}: {formatCurrency(item.amount, settings)} ({((item.amount / data.reduce((sum, d) => sum + d.amount, 0)) * 100).toFixed(1)}%)
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };

  const renderTopPerformers = () => {
    if (!analyticsData || analyticsData.topPerformers.length === 0) return null;

    return (
      <ThemedView style={styles.performersSection}>
        <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Top Performers
        </ThemedText>
        {analyticsData.topPerformers.map((performer, index) => {
          const metrics = workerMetrics.find(m => m.houseHelpId === performer.id);
          return (
            <ThemedView key={performer.id} style={[styles.performerCard]}>
              <ThemedView style={styles.performerHeader}>
                <ThemedView style={[styles.performerRank, { backgroundColor: theme.colors.primary + '20' }]}>
                  <ThemedText style={[styles.rankText, { color: theme.colors.primary }]}>
                    #{index + 1}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.performerInfo}>
                  <ThemedText style={[styles.performerName, { color: theme.colors.text }]}>
                    {performer.name}
                  </ThemedText>
                  <ThemedText style={[styles.performerDetails, { color: theme.colors.text + '70' }]}>
                    {formatCurrency(performer.monthlySalary, settings)}/month • {performer.shifts} shifts/day
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              {metrics && (
                <ThemedView style={styles.performerMetrics}>
                  <ThemedView style={styles.metricItem}>
                    <Icon
                      name="checkmark-circle-outline"
                      type="ionicon"
                      size={16}
                      color="#4CAF50"
                    />
                    <ThemedText style={[styles.metricLabel, { color: theme.colors.text + '70' }]}>
                      Attendance
                    </ThemedText>
                    <ThemedText style={[styles.metricValue, { color: theme.colors.text }]}>
                      {metrics.attendanceRate.toFixed(1)}%
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.metricItem}>
                    <Icon
                      name="speedometer-outline"
                      type="ionicon"
                      size={16}
                      color="#FF9800"
                    />
                    <ThemedText style={[styles.metricLabel, { color: theme.colors.text + '70' }]}>
                      Efficiency
                    </ThemedText>
                    <ThemedText style={[styles.metricValue, { color: theme.colors.text }]}>
                      {metrics.efficiency.toFixed(1)}%
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.metricItem}>
                    <Icon
                      name="cash-outline"
                      type="ionicon"
                      size={16}
                      color="#2196F3"
                    />
                    <ThemedText style={[styles.metricLabel, { color: theme.colors.text + '70' }]}>
                      Earned
                    </ThemedText>
                    <ThemedText style={[styles.metricValue, { color: theme.colors.text }]}>
                      {formatCurrency(metrics.totalEarned, settings)}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              )}
            </ThemedView>
          );
        })}
      </ThemedView>
    );
  };

  const renderLoadingState = () => (
    <SafeAreaWrapper>
      <ThemedView style={styles.loadingContainer}>
        <ThemedView style={[styles.loadingIcon, { backgroundColor: theme.colors.primary + '20' }]}>
          <Icon
            name="bar-chart"
            type="ionicon"
            size={32}
            color={theme.colors.primary}
          />
        </ThemedView>
        <ThemedText style={[styles.loadingTitle, { color: theme.colors.text }]}>
          Loading analytics...
        </ThemedText>
        <ThemedText style={[styles.loadingSubtext, { color: theme.colors.text + '70' }]}>
          Analyzing attendance and payment data
        </ThemedText>
      </ThemedView>
    </SafeAreaWrapper>
  );

  const renderEmptyState = () => (
    <SafeAreaWrapper>
      <ThemedView style={styles.emptyContainer}>
        <ThemedView style={[styles.emptyIcon, { backgroundColor: theme.colors.primary + '20' }]}>
          <Icon
            name="bar-chart"
            type="ionicon"
            size={32}
            color={theme.colors.primary}
          />
        </ThemedView>
        <ThemedText style={[styles.emptyTitle, { color: theme.colors.text }]}>
          No Data Available
        </ThemedText>
        <ThemedText style={[styles.emptyMessage, { color: theme.colors.text + '70' }]}>
          Add house help workers to start tracking analytics and generate reports.
        </ThemedText>
      </ThemedView>
    </SafeAreaWrapper>
  );

  if (isLoading) {
    return renderLoadingState();
  }

  if (houseHelps.length === 0) {
    return renderEmptyState();
  }

  return (
    <SafeAreaWrapper>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderTimeRangeSelector()}
        {renderStatsCards()}
        {renderCostTrends()}
        {renderAttendanceTrends()}
        {renderPaymentBreakdown()}
        {renderTopPerformers()}

        <ThemedView style={styles.footer}>
          <ThemedText style={[styles.footerText, { color: theme.colors.text + '60' }]}>
            Data refreshed: {new Date().toLocaleString()}
          </ThemedText>
        </ThemedView>
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
  timeRangeSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.headline,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  timeRangeButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    ...shadows.sm,
  },
  timeRangeText: {
    ...typography.subhead,
    fontWeight: '500',
  },
  statsSection: {
    marginBottom: spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statCard: {
    width: '48%',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statTitle: {
    ...typography.caption1,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.title2,
    textAlign: 'center',
    fontWeight: '700',
  },
  chartSection: {
    marginBottom: spacing.xl,
  },
  chartCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  chartTitle: {
    ...typography.subhead,
    fontWeight: '600',
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  legendContainer: {
    marginTop: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    ...typography.caption1,
    flex: 1,
  },
  performersSection: {
    marginBottom: spacing.xl,
  },
  performerCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  performerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  performerRank: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    ...typography.title2,
    fontWeight: '700',
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    ...typography.subhead,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  performerDetails: {
    ...typography.caption1,
  },
  performerMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  metricLabel: {
    ...typography.caption1,
    textAlign: 'center',
  },
  metricValue: {
    ...typography.subhead,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  loadingTitle: {
    ...typography.title2,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  loadingSubtext: {
    ...typography.subhead,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  emptyTitle: {
    ...typography.title2,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyMessage: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption1,
    textAlign: 'center',
  },
});

