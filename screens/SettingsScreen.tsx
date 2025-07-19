import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSettings } from '@/contexts/SettingsContext';
import { borderRadius, shadows, spacing, typography } from '@/utils/spacing';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Switch } from 'react-native';
import { Button, Divider, Icon, ListItem, Overlay } from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.headline,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  sectionDescription: {
    ...typography.body,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  sectionCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  listItemContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  listItemTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  listItemSubtitle: {
    ...typography.footnote,
    marginTop: spacing.xs,
  },
  workingDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.lg,
  },
  dayButtonContainer: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  dayButton: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 50,
  },
  dayButtonText: {
    ...typography.caption1,
    fontWeight: '600',
  },
  resetButtonContainer: {
    width: '100%',
  },
  resetButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    ...shadows.sm,
  },
  resetButtonText: {
    ...typography.headline,
    fontWeight: '600',
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
  modalOverlay: {
    borderRadius: borderRadius.lg,
    maxHeight: '70%',
    width: '90%',
  },
  modalContent: {
    borderRadius: borderRadius.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  modalTitle: {
    ...typography.headline,
    fontWeight: '600',
  },
  closeButtonContainer: {
    marginLeft: spacing.sm,
  },
  closeButton: {
    backgroundColor: 'transparent',
    padding: spacing.sm,
  },
  modalOptionContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  modalOptionTitle: {
    ...typography.body,
    fontWeight: '500',
  },
});

const SettingsScreen: React.FC = () => {
  const { settings, loading, updateSettings, resetSettings } = useSettings();
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'currency' | 'theme' | 'language' | 'backup' | null>(null);

  const currencyOptions = [
    { label: '₹ Indian Rupee', value: 'INR', icon: 'cash-outline' },
    { label: '$ US Dollar', value: 'USD', icon: 'cash-outline' },
    { label: '€ Euro', value: 'EUR', icon: 'cash-outline' },
    { label: '£ British Pound', value: 'GBP', icon: 'cash-outline' },
    { label: '¥ Japanese Yen', value: 'JPY', icon: 'cash-outline' },
  ];

  const themeOptions = [
    { label: 'Auto (System)', value: 'auto', icon: 'phone-portrait-outline' },
    { label: 'Light', value: 'light', icon: 'sunny-outline' },
    { label: 'Dark', value: 'dark', icon: 'moon-outline' },
  ];

  const languageOptions = [
    { label: 'English', value: 'en', icon: 'language-outline' },
    { label: 'हिंदी (Hindi)', value: 'hi', icon: 'language-outline' },
  ];

  const backupOptions = [
    { label: 'Daily', value: 'daily', icon: 'calendar-outline' },
    { label: 'Weekly', value: 'weekly', icon: 'calendar-outline' },
    { label: 'Monthly', value: 'monthly', icon: 'calendar-outline' },
    { label: 'Never', value: 'never', icon: 'close-circle-outline' },
  ];

  const handleUpdateSettings = async (newSettings: any) => {
    try {
      await updateSettings(newSettings);
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings. Please try again.');
    }
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetSettings();
              Alert.alert('Success', 'Settings have been reset to default values.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset settings. Please try again.');
            }
          }
        }
      ]
    );
  };

  const openModal = (type: 'currency' | 'theme' | 'language' | 'backup') => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleSelect = (value: string) => {
    if (modalType === 'currency') {
      handleUpdateSettings({ currency: value });
    } else if (modalType === 'theme') {
      handleUpdateSettings({ themePreference: value });
    } else if (modalType === 'language') {
      handleUpdateSettings({ language: value });
    } else if (modalType === 'backup') {
      handleUpdateSettings({ backupFrequency: value });
    }
    setModalVisible(false);
    setModalType(null);
  };

  const getSelectedLabel = (type: string) => {
    switch (type) {
      case 'currency':
        return currencyOptions.find(opt => opt.value === settings.currency)?.label || '₹ Indian Rupee';
      case 'theme':
        return themeOptions.find(opt => opt.value === settings.themePreference)?.label || 'Auto (System)';
      case 'language':
        return languageOptions.find(opt => opt.value === settings.language)?.label || 'English';
      case 'backup':
        return backupOptions.find(opt => opt.value === settings.backupFrequency)?.label || 'Weekly';
      default:
        return '';
    }
  };

  const getModalOptions = () => {
    switch (modalType) {
      case 'currency': return currencyOptions;
      case 'theme': return themeOptions;
      case 'language': return languageOptions;
      case 'backup': return backupOptions;
      default: return [];
    }
  };

  const getDayName = (dayIndex: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  };

  const toggleWorkingDay = (dayIndex: number) => {
    const newWorkingDays = settings.defaultWorkingDays.includes(dayIndex)
      ? settings.defaultWorkingDays.filter(day => day !== dayIndex)
      : [...settings.defaultWorkingDays, dayIndex].sort();

    handleUpdateSettings({ defaultWorkingDays: newWorkingDays });
  };

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerContent}>
        <ThemedView style={styles.titleSection}>
          <ThemedText style={[styles.title, { color: theme.colors.text }]}>
            Settings
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.colors.text }]}>
            Customize your app experience
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderCurrencySection = () => (
    <ThemedView style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Currency & Format
      </ThemedText>
      <ThemedView style={styles.sectionCard}>
        <ListItem
          onPress={() => openModal('currency')}
          containerStyle={styles.listItemContainer}
        >
          <Icon
            name="cash-outline"
            type="ionicon"
            size={20}
            color={theme.colors.text + '60'}
          />
          <ListItem.Content>
            <ListItem.Title style={[styles.listItemTitle, { color: theme.colors.text }]}>
              Currency
            </ListItem.Title>
            <ListItem.Subtitle style={[styles.listItemSubtitle, { color: theme.colors.text + '70' }]}>
              {getSelectedLabel('currency')}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron color={theme.colors.text + '60'} />
        </ListItem>
      </ThemedView>
    </ThemedView>
  );

  const renderThemeSection = () => (
    <ThemedView style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Appearance
      </ThemedText>
      <ThemedView style={styles.sectionCard}>
        <ListItem
          onPress={() => openModal('theme')}
          containerStyle={styles.listItemContainer}
        >
          <Icon
            name="color-palette-outline"
            type="ionicon"
            size={20}
            color={theme.colors.text + '60'}
          />
          <ListItem.Content>
            <ListItem.Title style={[styles.listItemTitle, { color: theme.colors.text }]}>
              Theme Preference
            </ListItem.Title>
            <ListItem.Subtitle style={[styles.listItemSubtitle, { color: theme.colors.text + '70' }]}>
              {getSelectedLabel('theme')}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron color={theme.colors.text + '60'} />
        </ListItem>
      </ThemedView>
    </ThemedView>
  );

  const renderWorkingDaysSection = () => (
    <ThemedView style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Default Working Days
      </ThemedText>
      <ThemedText style={[styles.sectionDescription, { color: theme.colors.text + '70' }]}>
        Select default working days for new house helpers
      </ThemedText>
      <ThemedView style={styles.sectionCard}>
        <ThemedView style={styles.workingDaysContainer}>
          {[0, 1, 2, 3, 4, 5, 6].map(day => (
            <Button
              key={day}
              title={getDayName(day)}
              onPress={() => toggleWorkingDay(day)}
              buttonStyle={[
                styles.dayButton,
                {
                  backgroundColor: settings.defaultWorkingDays.includes(day)
                    ? theme.colors.primary
                    : 'transparent',
                  borderColor: settings.defaultWorkingDays.includes(day)
                    ? theme.colors.primary
                    : theme.colors.text + '30',
                }
              ]}
              titleStyle={[
                styles.dayButtonText,
                {
                  color: settings.defaultWorkingDays.includes(day)
                    ? '#FFFFFF'
                    : theme.colors.text
                }
              ]}
              containerStyle={styles.dayButtonContainer}
            />
          ))}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderNotificationSection = () => (
    <ThemedView style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Notifications
      </ThemedText>
      <ThemedView style={styles.sectionCard}>
        <ListItem containerStyle={styles.listItemContainer}>
          <Icon
            name="notifications-outline"
            type="ionicon"
            size={20}
            color={theme.colors.text + '60'}
          />
          <ListItem.Content>
            <ListItem.Title style={[styles.listItemTitle, { color: theme.colors.text }]}>
              Enable Notifications
            </ListItem.Title>
            <ListItem.Subtitle style={[styles.listItemSubtitle, { color: theme.colors.text + '70' }]}>
              Receive daily reminders and updates
            </ListItem.Subtitle>
          </ListItem.Content>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(value) => handleUpdateSettings({ notificationsEnabled: value })}
            trackColor={{ false: theme.colors.text + '20', true: theme.colors.primary + '40' }}
            thumbColor={settings.notificationsEnabled ? theme.colors.primary : theme.colors.text + '40'}
          />
        </ListItem>

        <Divider color={theme.colors.text + '10'} />

        <ListItem containerStyle={styles.listItemContainer}>
          <Icon
            name="time-outline"
            type="ionicon"
            size={20}
            color={theme.colors.text + '60'}
          />
          <ListItem.Content>
            <ListItem.Title style={[styles.listItemTitle, { color: theme.colors.text }]}>
              Daily Reminder Time
            </ListItem.Title>
            <ListItem.Subtitle style={[styles.listItemSubtitle, { color: theme.colors.text + '70' }]}>
              {settings.notificationTime}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>

        <Divider color={theme.colors.text + '10'} />

        <ListItem containerStyle={styles.listItemContainer}>
          <Icon
            name="calendar-outline"
            type="ionicon"
            size={20}
            color={theme.colors.text + '60'}
          />
          <ListItem.Content>
            <ListItem.Title style={[styles.listItemTitle, { color: theme.colors.text }]}>
              Weekly Summary
            </ListItem.Title>
            <ListItem.Subtitle style={[styles.listItemSubtitle, { color: theme.colors.text + '70' }]}>
              Get weekly attendance and payment summaries
            </ListItem.Subtitle>
          </ListItem.Content>
          <Switch
            value={settings.weeklyReminders}
            onValueChange={(value) => handleUpdateSettings({ weeklyReminders: value })}
            trackColor={{ false: theme.colors.text + '20', true: theme.colors.primary + '40' }}
            thumbColor={settings.weeklyReminders ? theme.colors.primary : theme.colors.text + '40'}
          />
        </ListItem>

        <Divider color={theme.colors.text + '10'} />

        <ListItem containerStyle={styles.listItemContainer}>
          <Icon
            name="document-text-outline"
            type="ionicon"
            size={20}
            color={theme.colors.text + '60'}
          />
          <ListItem.Content>
            <ListItem.Title style={[styles.listItemTitle, { color: theme.colors.text }]}>
              Monthly Reports
            </ListItem.Title>
            <ListItem.Subtitle style={[styles.listItemSubtitle, { color: theme.colors.text + '70' }]}>
              Receive detailed monthly reports
            </ListItem.Subtitle>
          </ListItem.Content>
          <Switch
            value={settings.monthlyReports}
            onValueChange={(value) => handleUpdateSettings({ monthlyReports: value })}
            trackColor={{ false: theme.colors.text + '20', true: theme.colors.primary + '40' }}
            thumbColor={settings.monthlyReports ? theme.colors.primary : theme.colors.text + '40'}
          />
        </ListItem>
      </ThemedView>
    </ThemedView>
  );

  const renderPreferencesSection = () => (
    <ThemedView style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
        App Preferences
      </ThemedText>
      <ThemedView style={styles.sectionCard}>
        <ListItem
          onPress={() => openModal('language')}
          containerStyle={styles.listItemContainer}
        >
          <Icon
            name="language-outline"
            type="ionicon"
            size={20}
            color={theme.colors.text + '60'}
          />
          <ListItem.Content>
            <ListItem.Title style={[styles.listItemTitle, { color: theme.colors.text }]}>
              Language
            </ListItem.Title>
            <ListItem.Subtitle style={[styles.listItemSubtitle, { color: theme.colors.text + '70' }]}>
              {getSelectedLabel('language')}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron color={theme.colors.text + '60'} />
        </ListItem>

        <Divider color={theme.colors.text + '10'} />

        <ListItem
          onPress={() => openModal('backup')}
          containerStyle={styles.listItemContainer}
        >
          <Icon
            name="cloud-upload-outline"
            type="ionicon"
            size={20}
            color={theme.colors.text + '60'}
          />
          <ListItem.Content>
            <ListItem.Title style={[styles.listItemTitle, { color: theme.colors.text }]}>
              Backup Frequency
            </ListItem.Title>
            <ListItem.Subtitle style={[styles.listItemSubtitle, { color: theme.colors.text + '70' }]}>
              {getSelectedLabel('backup')}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron color={theme.colors.text + '60'} />
        </ListItem>

        <Divider color={theme.colors.text + '10'} />

        <ListItem containerStyle={styles.listItemContainer}>
          <Icon
            name="help-circle-outline"
            type="ionicon"
            size={20}
            color={theme.colors.text + '60'}
          />
          <ListItem.Content>
            <ListItem.Title style={[styles.listItemTitle, { color: theme.colors.text }]}>
              Show Help Tips
            </ListItem.Title>
            <ListItem.Subtitle style={[styles.listItemSubtitle, { color: theme.colors.text + '70' }]}>
              Display helpful tips and guidance
            </ListItem.Subtitle>
          </ListItem.Content>
          <Switch
            value={settings.showHelpTips}
            onValueChange={(value) => handleUpdateSettings({ showHelpTips: value })}
            trackColor={{ false: theme.colors.text + '20', true: theme.colors.primary + '40' }}
            thumbColor={settings.showHelpTips ? theme.colors.primary : theme.colors.text + '40'}
          />
        </ListItem>

        <Divider color={theme.colors.text + '10'} />

        <ListItem containerStyle={styles.listItemContainer}>
          <Icon
            name="shield-checkmark-outline"
            type="ionicon"
            size={20}
            color={theme.colors.text + '60'}
          />
          <ListItem.Content>
            <ListItem.Title style={[styles.listItemTitle, { color: theme.colors.text }]}>
              Confirm Deletions
            </ListItem.Title>
            <ListItem.Subtitle style={[styles.listItemSubtitle, { color: theme.colors.text + '70' }]}>
              Ask for confirmation before deleting
            </ListItem.Subtitle>
          </ListItem.Content>
          <Switch
            value={settings.confirmDeletions}
            onValueChange={(value) => handleUpdateSettings({ confirmDeletions: value })}
            trackColor={{ false: theme.colors.text + '20', true: theme.colors.primary + '40' }}
            thumbColor={settings.confirmDeletions ? theme.colors.primary : theme.colors.text + '40'}
          />
        </ListItem>
      </ThemedView>
    </ThemedView>
  );

  const renderActionsSection = () => (
    <ThemedView style={styles.section}>
      <Button
        title="Reset All Settings"
        onPress={handleResetSettings}
        icon={
          <Icon
            name="refresh-outline"
            type="ionicon"
            size={20}
            color="#FF6B6B"
            style={{ marginRight: spacing.sm }}
          />
        }
        buttonStyle={[
          styles.resetButton,
          { backgroundColor: 'transparent', borderColor: '#FF6B6B' }
        ]}
        titleStyle={[styles.resetButtonText, { color: '#FF6B6B' }]}
        containerStyle={styles.resetButtonContainer}
      />
    </ThemedView>
  );

  const renderModal = () => (
    <Overlay
      isVisible={modalVisible}
      onBackdropPress={() => setModalVisible(false)}
      overlayStyle={[styles.modalOverlay, { backgroundColor: theme.colors.card }]}
    >
      <ThemedView style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
        <ThemedView style={[styles.modalHeader, { borderBottomColor: theme.colors.text + '20' }]}>
          <ThemedText style={[styles.modalTitle, { color: theme.colors.text }]}>
            Select {modalType ? modalType.charAt(0).toUpperCase() + modalType.slice(1) : ''}
          </ThemedText>
          <Button
            icon={
              <Icon
                name="close"
                type="ionicon"
                size={24}
                color={theme.colors.text}
              />
            }
            onPress={() => setModalVisible(false)}
            buttonStyle={styles.closeButton}
            containerStyle={styles.closeButtonContainer}
          />
        </ThemedView>

        <FlatList
          data={getModalOptions()}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <ListItem
              onPress={() => handleSelect(item.value)}
              containerStyle={[styles.modalOptionContainer, { backgroundColor: theme.colors.card }]}
            >
              <Icon
                name={item.icon}
                type="ionicon"
                size={20}
                color={theme.colors.text + '60'}
              />
              <ListItem.Content>
                <ListItem.Title style={[styles.modalOptionTitle, { color: theme.colors.text }]}>
                  {item.label}
                </ListItem.Title>
              </ListItem.Content>
              {((modalType === 'currency' && item.value === settings.currency) ||
                (modalType === 'theme' && item.value === settings.themePreference) ||
                (modalType === 'language' && item.value === settings.language) ||
                (modalType === 'backup' && item.value === settings.backupFrequency)) && (
                  <Icon
                    name="checkmark"
                    type="ionicon"
                    size={20}
                    color={theme.colors.primary}
                  />
                )}
            </ListItem>
          )}
        />
      </ThemedView>
    </Overlay>
  );

  const renderLoadingState = () => (
    <ThemedView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <ThemedText style={[styles.loadingText, { color: theme.colors.text + '70' }]}>
        Loading settings...
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
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {renderCurrencySection()}
        {renderThemeSection()}
        {renderWorkingDaysSection()}
        {renderNotificationSection()}
        {renderPreferencesSection()}
        {renderActionsSection()}
      </ScrollView>
      {renderModal()}
    </SafeAreaWrapper>
  );
};

export default SettingsScreen;
