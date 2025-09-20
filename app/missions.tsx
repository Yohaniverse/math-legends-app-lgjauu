
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles, fonts } from '../styles/commonStyles';
import { useGameState } from '../hooks/useGameState';
import GameButton from '../components/GameButton';
import ProgressRing from '../components/ProgressRing';
import CharacterAvatar from '../components/CharacterAvatar';

export default function MissionsScreen() {
  const router = useRouter();
  const { dailyMissions, playerProgress } = useGameState();

  const completedMissions = dailyMissions.filter(mission => mission.completed).length;
  const totalRewards = dailyMissions.reduce((total, mission) => {
    if (mission.completed) {
      return {
        stars: total.stars + mission.reward.stars,
        coins: total.coins + mission.reward.coins,
      };
    }
    return total;
  }, { stars: 0, coins: 0 });

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
            <Text style={styles.headerTitle}>Daily Missions</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Character */}
          <CharacterAvatar 
            size={80}
            showMessage={true}
            message="Complete missions to earn amazing rewards! 🎯"
          />

          {/* Progress Overview */}
          <View style={[commonStyles.card, styles.overviewCard]}>
            <Text style={styles.cardTitle}>Today&apos;s Progress</Text>
            
            <View style={styles.overviewContent}>
              <ProgressRing 
                progress={dailyMissions.length > 0 ? (completedMissions / dailyMissions.length) * 100 : 0}
                size={100}
                color={colors.success}
              >
                <View style={styles.ringContent}>
                  <Text style={styles.completedText}>{completedMissions}</Text>
                  <Text style={styles.totalText}>/{dailyMissions.length}</Text>
                </View>
              </ProgressRing>
              
              <View style={styles.rewardsEarned}>
                <Text style={styles.rewardsTitle}>Earned Today:</Text>
                <View style={styles.rewardRow}>
                  <Text style={styles.rewardText}>⭐ {totalRewards.stars} Stars</Text>
                </View>
                <View style={styles.rewardRow}>
                  <Text style={styles.rewardText}>🪙 {totalRewards.coins} Coins</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Missions List */}
          <View style={styles.missionsContainer}>
            <Text style={styles.sectionTitle}>Today&apos;s Missions</Text>
            
            {dailyMissions.map((mission, index) => (
              <View key={mission.id} style={[commonStyles.card, styles.missionCard]}>
                <View style={styles.missionHeader}>
                  <View style={styles.missionInfo}>
                    <Text style={styles.missionTitle}>{mission.title}</Text>
                    <Text style={styles.missionDescription}>{mission.description}</Text>
                  </View>
                  
                  <View style={styles.missionStatus}>
                    {mission.completed ? (
                      <Text style={styles.completedEmoji}>✅</Text>
                    ) : (
                      <Text style={styles.pendingEmoji}>⏳</Text>
                    )}
                  </View>
                </View>
                
                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${(mission.progress / mission.target) * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {mission.progress}/{mission.target}
                  </Text>
                </View>
                
                {/* Rewards */}
                <View style={styles.missionRewards}>
                  <Text style={styles.rewardsLabel}>Rewards:</Text>
                  <View style={styles.rewardsRow}>
                    <Text style={styles.rewardItem}>⭐ {mission.reward.stars}</Text>
                    <Text style={styles.rewardItem}>🪙 {mission.reward.coins}</Text>
                  </View>
                </View>
                
                {/* Action Button */}
                {!mission.completed && (
                  <GameButton
                    title={`Play ${mission.operation || 'Math'}`}
                    onPress={() => router.push(`/game?mode=learning`)}
                    variant="primary"
                    size="small"
                    style={styles.playButton}
                  />
                )}
              </View>
            ))}
          </View>

          {/* All Completed Message */}
          {completedMissions === dailyMissions.length && dailyMissions.length > 0 && (
            <View style={[commonStyles.card, styles.completedCard]}>
              <Text style={styles.completedTitle}>🎉 All Missions Completed!</Text>
              <Text style={styles.completedMessage}>
                Amazing work! Come back tomorrow for new missions!
              </Text>
              <GameButton
                title="Continue Playing"
                onPress={() => router.push('/game?mode=challenge')}
                variant="success"
                size="medium"
                style={styles.continueButton}
              />
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/game?mode=learning')}
            >
              <Text style={styles.quickActionEmoji}>🎓</Text>
              <Text style={styles.quickActionText}>Learning</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/game?mode=challenge')}
            >
              <Text style={styles.quickActionEmoji}>⚡</Text>
              <Text style={styles.quickActionText}>Challenge</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/progress')}
            >
              <Text style={styles.quickActionEmoji}>📊</Text>
              <Text style={styles.quickActionText}>Progress</Text>
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
  overviewCard: {
    marginVertical: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  overviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ringContent: {
    alignItems: 'center',
  },
  completedText: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  totalText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textLight,
  },
  rewardsEarned: {
    flex: 1,
    marginLeft: 20,
  },
  rewardsTitle: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.text,
    marginBottom: 8,
  },
  rewardRow: {
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textLight,
  },
  missionsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 16,
  },
  missionCard: {
    marginBottom: 16,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 4,
  },
  missionDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textLight,
  },
  missionStatus: {
    marginLeft: 16,
  },
  completedEmoji: {
    fontSize: 24,
  },
  pendingEmoji: {
    fontSize: 24,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.textLight,
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text,
    minWidth: 40,
  },
  missionRewards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardsLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  rewardItem: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textLight,
  },
  playButton: {
    alignSelf: 'flex-start',
  },
  completedCard: {
    alignItems: 'center',
    marginBottom: 30,
  },
  completedTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.success,
    marginBottom: 8,
  },
  completedMessage: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  continueButton: {
    alignSelf: 'center',
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
