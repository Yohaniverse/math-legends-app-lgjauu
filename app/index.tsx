
import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { colors, commonStyles, fonts } from '../styles/commonStyles';
import { useGameState } from '../hooks/useGameState';
import CharacterAvatar from '../components/CharacterAvatar';
import GameButton from '../components/GameButton';
import ProgressRing from '../components/ProgressRing';
import { getRankEmoji } from '../data/gameData';

export default function HomeScreen() {
  const router = useRouter();
  const { playerProgress, dailyMissions, isLoading } = useGameState();
  
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.title}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const completedMissions = dailyMissions.filter(mission => mission.completed).length;
  const missionProgress = dailyMissions.length > 0 ? (completedMissions / dailyMissions.length) * 100 : 0;

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={commonStyles.content}>
          {/* Header with Character */}
          <View style={styles.header}>
            <CharacterAvatar 
              size={100} 
              showMessage={true}
              message="Hello! Ready to play math today? 🎯"
            />
            
            <View style={styles.playerInfo}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <View style={styles.rankContainer}>
                <Text style={styles.rankEmoji}>{getRankEmoji(playerProgress.rank)}</Text>
                <Text style={styles.rankText}>{playerProgress.rank}</Text>
              </View>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{playerProgress.totalStars}</Text>
                  <Text style={styles.statLabel}>⭐ Stars</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{playerProgress.totalCoins}</Text>
                  <Text style={styles.statLabel}>🪙 Coins</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{playerProgress.dailyStreak}</Text>
                  <Text style={styles.statLabel}>🔥 Streak</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Daily Mission Progress */}
          <View style={[commonStyles.card, styles.missionCard]}>
            <Text style={styles.cardTitle}>Today&apos;s Progress</Text>
            <View style={styles.progressContainer}>
              <ProgressRing 
                progress={missionProgress}
                size={80}
                color={colors.success}
              />
              <View style={styles.missionInfo}>
                <Text style={styles.missionText}>
                  {completedMissions} of {dailyMissions.length} missions completed
                </Text>
                <TouchableOpacity 
                  style={styles.viewMissionsButton}
                  onPress={() => router.push('/missions')}
                >
                  <Text style={styles.viewMissionsText}>View Missions →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Game Mode Buttons */}
          <View style={styles.gameModesContainer}>
            <Text style={styles.sectionTitle}>Choose Your Adventure</Text>
            
            <GameButton
              title="🎓 Learning Mode"
              onPress={() => router.push('/game?mode=learning')}
              variant="primary"
              size="large"
              style={styles.modeButton}
            />
            
            <GameButton
              title="⚡ Challenge Mode"
              onPress={() => router.push('/game?mode=challenge')}
              variant="secondary"
              size="large"
              style={styles.modeButton}
            />
            
            <GameButton
              title="🗺️ Adventure Mode"
              onPress={() => router.push('/game?mode=adventure')}
              variant="success"
              size="large"
              style={styles.modeButton}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/progress')}
            >
              <Text style={styles.quickActionEmoji}>📊</Text>
              <Text style={styles.quickActionText}>Progress</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/missions')}
            >
              <Text style={styles.quickActionEmoji}>🎯</Text>
              <Text style={styles.quickActionText}>Missions</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/settings')}
            >
              <Text style={styles.quickActionEmoji}>⚙️</Text>
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 30,
  },
  playerInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 8,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rankEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  rankText: {
    fontSize: 20,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textLight,
    marginTop: 4,
  },
  missionCard: {
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  missionInfo: {
    flex: 1,
    marginLeft: 20,
  },
  missionText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
    marginBottom: 8,
  },
  viewMissionsButton: {
    alignSelf: 'flex-start',
  },
  viewMissionsText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  gameModesContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  modeButton: {
    marginBottom: 16,
    width: '100%',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    minWidth: 80,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 2,
  },
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text,
  },
});
