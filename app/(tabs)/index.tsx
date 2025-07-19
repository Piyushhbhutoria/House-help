import { HouseHelpItem } from '@/components/HouseHelpItem';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHouseHelp } from '@/contexts/HouseHelpContext';
import { borderRadius, shadows, spacing, typography } from '@/utils/spacing';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Button, Divider, Icon } from 'react-native-elements';

const HomeScreen: React.FC = () => {
  const { houseHelps } = useHouseHelp();
  const router = useRouter();
  const theme = useTheme();

  const handleAddHouseHelp = () => {
    router.push('/add-house-help');
  };

  const renderEmptyState = () => (
    <ThemedView style={styles.emptyContainer}>
      <Icon
        name="people-outline"
        type="ionicon"
        size={64}
        color={theme.colors.text + '40'}
        style={styles.emptyIcon}
      />
      <ThemedText style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No House Help Added
      </ThemedText>
      <ThemedText style={[styles.emptyText, { color: theme.colors.text }]}>
        Get started by adding your first house helper to manage their attendance and payments.
      </ThemedText>
      <Button
        title="Add Your First House Help"
        onPress={handleAddHouseHelp}
        icon={
          <Icon
            name="person-add"
            type="ionicon"
            size={20}
            color="#FFFFFF"
            style={{ marginRight: spacing.sm }}
          />
        }
        buttonStyle={[styles.addFirstButton, { backgroundColor: theme.colors.primary }]}
        titleStyle={styles.addFirstButtonText}
        containerStyle={styles.addFirstButtonContainer}
      />
    </ThemedView>
  );

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerContent}>
        <ThemedView style={styles.titleSection}>
          <ThemedText style={[styles.title, { color: theme.colors.text }]}>
            House Help Manager
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.colors.text }]}>
            Manage your house helpers and track their attendance
          </ThemedText>
        </ThemedView>
        <Button
          title="Add New"
          onPress={handleAddHouseHelp}
          icon={
            <Icon
              name="add"
              type="ionicon"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: spacing.sm }}
            />
          }
          buttonStyle={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          titleStyle={styles.addButtonText}
          containerStyle={styles.addButtonContainer}
        />
      </ThemedView>

      {houseHelps.length > 0 && (
        <>
          <Divider style={{ marginVertical: spacing.xl }} />
          <ThemedView style={styles.statsContainer}>
            <ThemedView style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
              <Icon
                name="people"
                type="ionicon"
                size={24}
                color={theme.colors.primary}
              />
              <ThemedText style={[styles.statNumber, { color: theme.colors.text }]}>
                {houseHelps.length}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.colors.text }]}>
                Total Helpers
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </>
      )}
    </ThemedView>
  );

  return (
    <SafeAreaWrapper>
      <ThemedView style={styles.container}>
        <FlatList
          data={houseHelps}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HouseHelpItem houseHelp={item} />}
          ListHeaderComponent={renderHeader}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
    marginRight: spacing.lg,
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
  addButtonContainer: {
    alignSelf: 'flex-start',
  },
  addButton: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  addButtonText: {
    color: '#FFFFFF',
    ...typography.subhead,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  statNumber: {
    ...typography.title2,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  statLabel: {
    ...typography.caption1,
    opacity: 0.7,
  },
  separator: {
    height: spacing.md,
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
    marginBottom: spacing.xxl,
  },
  addFirstButtonContainer: {
    width: '100%',
  },
  addFirstButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    ...shadows.md,
  },
  addFirstButtonText: {
    color: '#FFFFFF',
    ...typography.headline,
    fontWeight: '600',
  },
});

export default HomeScreen;
