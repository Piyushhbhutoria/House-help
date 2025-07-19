import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { borderRadius, shadows, spacing, typography } from '@/utils/spacing';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Divider, Icon, ListItem } from 'react-native-elements';

const MoreScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();

  const menuItems = [
    {
      title: 'Analytics Dashboard',
      icon: 'bar-chart-outline',
      route: '/reports',
      description: 'View trends and analytics',
      section: 'analytics',
    },
    {
      title: 'AI Insights',
      icon: 'bulb-outline',
      route: '/insights',
      description: 'Smart recommendations',
      section: 'analytics',
    },
    {
      title: 'Payment History',
      icon: 'time-outline',
      route: '/payment-history',
      section: 'general',
    },
    {
      title: 'Settings',
      icon: 'settings-outline',
      route: '/settings',
      section: 'general',
    },
  ];

  const analyticsItems = menuItems.filter(item => item.section === 'analytics');
  const generalItems = menuItems.filter(item => item.section === 'general');

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerContent}>
        <ThemedView style={styles.titleSection}>
          <ThemedText style={[styles.title, { color: theme.colors.text }]}>
            More Options
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.colors.text }]}>
            Additional features and settings
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderSection = (title: string, items: typeof menuItems, iconName: string) => (
    <ThemedView style={styles.section}>
      <ThemedView style={styles.sectionHeader}>
        <Icon
          name={iconName}
          type="ionicon"
          size={20}
          color={theme.colors.primary}
          style={styles.sectionIcon}
        />
        <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {title}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.sectionCard}>
        {items.map((item, index) => (
          <React.Fragment key={item.route}>
            <ListItem
              onPress={() => router.push(item.route as any)}
              containerStyle={styles.listItemContainer}
            >
              <ThemedView style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                <Icon
                  name={item.icon}
                  type="ionicon"
                  size={20}
                  color={theme.colors.primary}
                />
              </ThemedView>

              <ListItem.Content>
                <ListItem.Title style={[styles.menuItemTitle, { color: theme.colors.text }]}>
                  {item.title}
                </ListItem.Title>
                {item.description && (
                  <ListItem.Subtitle style={[styles.menuItemDescription, { color: theme.colors.text }]}>
                    {item.description}
                  </ListItem.Subtitle>
                )}
              </ListItem.Content>

              <ListItem.Chevron color={theme.colors.text + '60'} />
            </ListItem>

            {index < items.length - 1 && (
              <Divider style={[styles.divider, { backgroundColor: theme.colors.text + '10' }]} />
            )}
          </React.Fragment>
        ))}
      </ThemedView>
    </ThemedView>
  );

  const renderQuickActions = () => (
    <ThemedView style={styles.quickActionsSection}>
      <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Quick Actions
      </ThemedText>

      <ThemedView style={styles.quickActionsGrid}>
        <Button
          title="Add Payment"
          onPress={() => router.push('/payments')}
          icon={
            <Icon
              name="add-circle-outline"
              type="ionicon"
              size={20}
              color="#FFFFFF"
              style={{ marginBottom: spacing.xs }}
            />
          }
          buttonStyle={[styles.quickActionButton, { backgroundColor: theme.colors.primary }]}
          titleStyle={styles.quickActionButtonText}
          containerStyle={styles.quickActionButtonContainer}
        />

        <Button
          title="View Reports"
          onPress={() => router.push('/reports')}
          icon={
            <Icon
              name="document-text-outline"
              type="ionicon"
              size={20}
              color="#FFFFFF"
              style={{ marginBottom: spacing.xs }}
            />
          }
          buttonStyle={[styles.quickActionButton, { backgroundColor: theme.colors.primary }]}
          titleStyle={styles.quickActionButtonText}
          containerStyle={styles.quickActionButtonContainer}
        />
      </ThemedView>
    </ThemedView>
  );

  return (
    <SafeAreaWrapper>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {renderQuickActions()}
        {renderSection('Analytics', analyticsItems, 'analytics-outline')}
        {renderSection('General', generalItems, 'settings-outline')}
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
  quickActionsSection: {
    marginBottom: spacing.xl,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  quickActionButtonContainer: {
    flex: 1,
  },
  quickActionButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    ...shadows.sm,
  },
  quickActionButtonText: {
    color: '#FFFFFF',
    ...typography.caption1,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionIcon: {
    marginRight: spacing.sm,
  },
  sectionTitle: {
    ...typography.headline,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  listItemContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuItemTitle: {
    ...typography.subhead,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  menuItemDescription: {
    ...typography.caption1,
    opacity: 0.7,
  },
  divider: {
    marginHorizontal: spacing.lg,
  },
});

export default MoreScreen;
