import React from 'react';
import { StyleSheet, Switch, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const SettingsScreen: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const theme = useTheme();

  return (
    <SafeAreaWrapper>
      <ScrollView>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>Settings</ThemedText>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle">Notifications</ThemedText>
            
            <ThemedView style={styles.settingItem}>
              <ThemedText>Enable Notifications</ThemedText>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(value) => updateSettings({ notificationsEnabled: value })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            </ThemedView>

            <ThemedView style={styles.settingItem}>
              <ThemedText>Daily Reminder Time</ThemedText>
              <DateTimePicker
                value={new Date(`2000-01-01T${settings.notificationTime}`)}
                mode="time"
                is24Hour={true}
                onChange={(event, date) => {
                  if (date) {
                    updateSettings({ 
                      notificationTime: date.toTimeString().split(' ')[0].slice(0, 5) 
                    });
                  }
                }}
              />
            </ThemedView>

            <ThemedView style={styles.settingItem}>
              <ThemedText>Weekly Summary</ThemedText>
              <Switch
                value={settings.weeklyReminders}
                onValueChange={(value) => updateSettings({ weeklyReminders: value })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            </ThemedView>

            <ThemedView style={styles.settingItem}>
              <ThemedText>Monthly Reports</ThemedText>
              <Switch
                value={settings.monthlyReports}
                onValueChange={(value) => updateSettings({ monthlyReports: value })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
});

export default SettingsScreen;
