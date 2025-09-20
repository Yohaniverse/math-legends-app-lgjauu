
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles, fonts } from '../styles/commonStyles';
import { useGameState } from '../hooks/useGameState';
import { getRankEmoji, rankThresholds } from '../data/gameData';
import GameButton from '../components/GameButton';
import ProgressRing from '../components/ProgressRing';
import CharacterAvatar from '../components/CharacterAvatar';

export default function ProgressScreen() {
  const router = useRouter();
  const { playerProgress } = useGameState();

  const getCurrentRankProgress = () => {
    const ranks = Object.keys(rankThresholds) as Array<keyof typeof rankThresholds>;
    const currentRankIndex = ranks.indexOf(playerProgress.rank);
    
    if (currentRankIndex === ranks.length - 1) {
      // Already at highest rank
      return { progress: 100, nextRank: null, starsNeeded: 0 };
    }
    
    const nextRank = ranks[currentRankIndex + 1];
    const currentThreshold = rankThresholds[playerProgress.rank];
    const nextThreshold = rankThresholds[nextRank];
    const progress = ((playerProgress.totalStars - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    const starsNeeded = nextThreshold - playerProgress.totalStars;
    
    return { progress: Math.max(0, progress), nextRank, starsNeeded };
  };

  const rankProgress = getCurrentRankProgress();

  const getSkillProgress = (skill: keyof typeof playerProgress.skillsProgress) => {
    const total = Object.values(playerProgress.skillsProgress).reduce((sum, val) => sum + val, 0);
    return total > 0 ? (playerProgress.skillsProgress[skill] / total) * 100 : 0;
  };

  const getSkillLevel = (progress: number) => {
    if (progress >= 40) return 'Expert';
    if (progress >= 25) return 'Advanced';
    if (progress >= 15) return 'Intermediate';
    if (progress >= 5) return 'Beginner';
    return 'Starter';
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
            <Text style={styles.headerTitle}>Your Progress</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Character */}
          <CharacterAvatar 
            size={80}
            showMessage={true}
            message="Look how much you've grown! Keep up the amazing work! 📈"
          />

          {/* Current Rank */}
          <View style={[commonStyles.card, styles.rankCard]}>
            <Text style={styles.cardTitle}>Current Rank</Text>
            
            <View style={styles.rankDisplay}>
              <Text style={styles.rankEmoji}>{getRankEmoji(playerProgress.rank)}</Text>
              <Text style={styles.rankName}>{playerProgress.rank}</Text>
            </View>
            
            {rankProgress.nextRank && (
              <View style={styles.rankProgressContainer}>
                <Text style={styles.progressLabel}>
                  Progress to {rankProgress.nextRank}
                </Text>
                <ProgressRing 
                  progress={rankProgress.progress}
                  size={80}
                  color={colors.accent}
                >
                  <Text style={styles.starsNeeded}>
                    {rankProgress.starsNeeded}
                  </Text>
                </ProgressRing>
                <Text style={styles.starsNeededLabel}>
                  stars needed
                </Text>
              </View>
            )}
            
            {!rankProgress.nextRank && (
              <View style={styles.maxRankContainer}>
                <Text style={styles.maxRankText}>🎉 Maximum Rank Achieved! 🎉</Text>
                <Text style={styles.maxRankSubtext}>You&apos;re a true Math Legend!</Text>
              </View>
            )}
          </View>

          {/* Stats Overview */}
          <View style={[commonStyles.card, styles.statsCard]}>
            <Text style={styles.cardTitle}>Your Stats</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{playerProgress.totalStars}</Text>
                <Text style={styles.statLabel}>⭐ Total Stars</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{playerProgress.totalCoins}</Text>
                <Text style={styles.statLabel}>🪙 Total Coins</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{playerProgress.dailyStreak}</Text>
                <Text style={styles.statLabel}>🔥 Daily Streak</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{playerProgress.level}</Text>
                <Text style={styles.statLabel}>📊 Level</Text>
              </View>
            </View>
          </View>

          {/* Skills Progress */}
          <View style={[commonStyles.card, styles.skillsCard]}>
            <Text style={styles.cardTitle}>Math Skills</Text>
            
            <View style={styles.skillsContainer}>
              {Object.entries(playerProgress.skillsProgress).map(([skill, progress]) => {
                const skillProgress = getSkillProgress(skill as keyof typeof playerProgress.skillsProgress);
                const skillLevel = getSkillLevel(skillProgress);
                
                return (
                  <View key={skill} style={styles.skillItem}>
                    <View style={styles.skillHeader}>
                      <Text style={styles.skillName}>
                        {skill.charAt(0).toUpperCase() + skill.slice(1)}
                      </Text>
                      <Text style={styles.skillLevel}>{skillLevel}</Text>
                    </View>
                    
                    <View style={styles.skillProgressContainer}>
                      <View style={styles.skillProgressBar}>
                        <View 
                          style={[
                            styles.skillProgressFill, 
                            { width: `${skillProgress}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.skillProgressText}>
                        {progress} problems solved
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Achievements */}
          <View style={[commonStyles.card, styles.achievementsCard]}>
            <Text style={styles.cardTitle}>Achievements</Text>
            
            <View style={styles.achievementsContainer}>
              <View style={styles.achievementItem}>
                <Text style={styles.achievementEmoji}>
                  {playerProgress.totalStars >= 100 ? '🌟' : '⭐'}
                </Text>
                <Text style={styles.achievementName}>Star Collector</Text>
                <Text style={styles.achievementDesc}>
                  {playerProgress.totalStars >= 100 ? 'Earned 100+ stars!' : 'Earn 100 stars'}
                </Text>
              </View>
              
              <View style={styles.achievementItem}>
                <Text style={styles.achievementEmoji}>
                  {playerProgress.dailyStreak >= 7 ? '🔥' : '📅'}
                </Text>
                <Text style={styles.achievementName}>Streak Master</Text>
                <Text style={styles.achievementDesc}>
                  {playerProgress.dailyStreak >= 7 ? '7+ day streak!' : 'Play 7 days in a row'}
                </Text>
              </View>
              
              <View style={styles.achievementItem}>
                <Text style={styles.achievementEmoji}>
                  {Object.values(playerProgress.skillsProgress).every(val => val >= 10) ? '🎓' : '📚'}
                </Text>
                <Text style={styles.achievementName}>Math Master</Text>
                <Text style={styles.achievementDesc}>
                  {Object.values(playerProgress.skillsProgress).every(val => val >= 10) 
                    ? 'Mastered all skills!' 
                    : 'Practice all math skills'}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <GameButton
              title="🎮 Continue Playing"
              onPress={() => router.push('/game?mode=learning')}
              variant="primary"
              size="large"
              style={styles.actionButton}
            />
            
            <GameButton
              title="🎯 View Missions"
              onPress={() => router.push('/missions')}
              variant="secondary"
              size="medium"
              style={styles.actionButton}
            />
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
  rankCard: {
    alignItems: 'center',
    marginVertical: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  rankDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rankEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  rankName: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  rankProgressContainer: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.text,
    marginBottom: 16,
  },
  starsNeeded: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  starsNeededLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textLight,
    marginTop: 8,
  },
  maxRankContainer: {
    alignItems: 'center',
  },
  maxRankText: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.success,
    marginBottom: 8,
  },
  maxRankSubtext: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textLight,
  },
  statsCard: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textLight,
    marginTop: 4,
  },
  skillsCard: {
    marginBottom: 20,
  },
  skillsContainer: {
    gap: 16,
  },
  skillItem: {
    marginBottom: 8,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  skillLevel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.primary,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  skillProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.textLight,
    borderRadius: 3,
    marginRight: 12,
  },
  skillProgressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 3,
  },
  skillProgressText: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: colors.textLight,
    minWidth: 80,
  },
  achievementsCard: {
    marginBottom: 30,
  },
  achievementsContainer: {
    gap: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  achievementEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementName: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
    flex: 1,
  },
  achievementDesc: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textLight,
    marginLeft: 8,
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  actionButton: {
    width: '100%',
  },
});
