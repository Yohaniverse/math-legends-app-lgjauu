
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles, fonts } from '../styles/commonStyles';
import GameButton from '../components/GameButton';
import CharacterAvatar from '../components/CharacterAvatar';

export default function SettingsScreen() {
  const router = useRouter();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [parentalMode, setParentalMode] = useState(false);

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive', 
          onPress: () => {
            // Clear localStorage
            if (typeof window !== 'undefined') {
              localStorage.clear();
            }
            Alert.alert('Success', 'Progress has been reset!');
            router.replace('/');
          }
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'For support, please email us at support@mathgame.com or visit our website.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={commonStyles.content}>
          {/* Header */}
          <View style={styles.header}>
            <GameButton
              title="← Back"
              onPress={() => router.back()}
              variant="secondary"
              size="small"
              style={styles.backButton}
            />
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Character */}
          <CharacterAvatar 
            size={80}
            showMessage={true}
            message="Let's customize your math adventure! ⚙️"
          />

          {/* Audio Settings */}
          <View style={[commonStyles.card, styles.settingsCard]}>
            <Text style={styles.cardTitle}>🔊 Audio Settings</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: colors.textLight, true: colors.primary }}
                thumbColor={soundEnabled ? colors.backgroundAlt : colors.background}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Background Music</Text>
              <Switch
                value={musicEnabled}
                onValueChange={setMusicEnabled}
                trackColor={{ false: colors.textLight, true: colors.primary }}
                thumbColor={musicEnabled ? colors.backgroundAlt : colors.background}
              />
            </View>
          </View>

          {/* Notification Settings */}
          <View style={[commonStyles.card, styles.settingsCard]}>
            <Text style={styles.cardTitle}>🔔 Notifications</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Daily Reminders</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.textLight, true: colors.primary }}
                thumbColor={notificationsEnabled ? colors.backgroundAlt : colors.background}
              />
            </View>
            
            <Text style={styles.settingDescription}>
              Get reminded to complete your daily math missions
            </Text>
          </View>

          {/* Parental Controls */}
          <View style={[commonStyles.card, styles.settingsCard]}>
            <Text style={styles.cardTitle}>👨‍👩‍👧‍👦 Parental Controls</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Parental Mode</Text>
              <Switch
                value={parentalMode}
                onValueChange={setParentalMode}
                trackColor={{ false: colors.textLight, true: colors.primary }}
                thumbColor={parentalMode ? colors.backgroundAlt : colors.background}
              />
            </View>
            
            <Text style={styles.settingDescription}>
              Enable additional safety features and progress reports
            </Text>
          </View>

          {/* Game Information */}
          <View style={[commonStyles.card, styles.settingsCard]}>
            <Text style={styles.cardTitle}>ℹ️ Game Information</Text>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version:</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Age Range:</Text>
              <Text style={styles.infoValue}>3-10 years</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Content:</Text>
              <Text style={styles.infoValue}>100% Free Educational Content</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <GameButton
              title="📧 Contact Support"
              onPress={handleContactSupport}
              variant="secondary"
              size="medium"
              style={styles.actionButton}
            />
            
            <GameButton
              title="🔄 Reset Progress"
              onPress={handleResetProgress}
              variant="primary"
              size="medium"
              style={[styles.actionButton, styles.resetButton]}
            />
          </View>

          {/* Privacy Notice */}
          <View style={[commonStyles.card, styles.privacyCard]}>
            <Text style={styles.privacyTitle}>🔒 Privacy & Safety</Text>
            <Text style={styles.privacyText}>
              This app is designed with children&apos;s safety in mind. We do not collect personal information, 
              and all data is stored locally on your device. The app is completely free with no ads or 
              in-app purchases.
            </Text>
          </View>

          {/* Credits */}
          <View style={styles.creditsContainer}>
            <Text style={styles.creditsText}>
              Made with ❤️ for young mathematicians everywhere
            </Text>
            <Text style={styles.versionText}>Math Adventure Game v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.textLight,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  placeholder: {
    width: 60,
  },
  settingsCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.text,
    flex: 1,
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textLight,
    marginTop: 8,
    fontStyle: 'italic',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textLight,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 30,
  },
  actionButton: {
    width: '100%',
  },
  resetButton: {
    backgroundColor: colors.error,
  },
  privacyCard: {
    marginBottom: 30,
  },
  privacyTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 12,
  },
  privacyText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textLight,
    lineHeight: 20,
  },
  creditsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  creditsText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  versionText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textLight,
  },
});
