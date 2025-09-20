
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, fonts } from '../styles/commonStyles';
import CharacterAvatar from '../components/CharacterAvatar';
import GameButton from '../components/GameButton';
import ProgressRing from '../components/ProgressRing';

export default function ResultsScreen() {
  const router = useRouter();
  const { correctAnswers, totalQuestions, starsEarned, coinsEarned, mode } = useLocalSearchParams<{
    correctAnswers: string;
    totalQuestions: string;
    starsEarned: string;
    coinsEarned: string;
    mode: string;
  }>();

  const correct = parseInt(correctAnswers || '0');
  const total = parseInt(totalQuestions || '0');
  const stars = parseInt(starsEarned || '0');
  const coins = parseInt(coinsEarned || '0');
  const percentage = total > 0 ? (correct / total) * 100 : 0;

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Outstanding! You're a math genius! 🌟";
    if (percentage >= 70) return "Great job! You're getting really good! 👏";
    if (percentage >= 50) return "Good work! Keep practicing! 💪";
    return "Nice try! Practice makes perfect! 🎯";
  };

  const getPerformanceEmoji = () => {
    if (percentage >= 90) return "🏆";
    if (percentage >= 70) return "🥇";
    if (percentage >= 50) return "🥈";
    return "🥉";
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={commonStyles.content}>
          {/* Character Celebration */}
          <CharacterAvatar 
            size={120}
            showMessage={true}
            message={getPerformanceMessage()}
          />

          {/* Performance Ring */}
          <View style={styles.performanceContainer}>
            <ProgressRing 
              progress={percentage}
              size={150}
              color={percentage >= 70 ? colors.success : percentage >= 50 ? colors.accent : colors.primary}
            >
              <View style={styles.ringContent}>
                <Text style={styles.performanceEmoji}>{getPerformanceEmoji()}</Text>
                <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
              </View>
            </ProgressRing>
          </View>

          {/* Results Summary */}
          <View style={[commonStyles.card, styles.resultsCard]}>
            <Text style={styles.cardTitle}>Game Results</Text>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Correct Answers:</Text>
              <Text style={styles.resultValue}>{correct} / {total}</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Game Mode:</Text>
              <Text style={styles.resultValue}>{mode?.charAt(0).toUpperCase()}{mode?.slice(1)}</Text>
            </View>
          </View>

          {/* Rewards */}
          <View style={[commonStyles.card, styles.rewardsCard]}>
            <Text style={styles.cardTitle}>Rewards Earned! 🎉</Text>
            
            <View style={styles.rewardsContainer}>
              <View style={styles.rewardItem}>
                <Text style={styles.rewardEmoji}>⭐</Text>
                <Text style={styles.rewardNumber}>+{stars}</Text>
                <Text style={styles.rewardLabel}>Stars</Text>
              </View>
              
              <View style={styles.rewardItem}>
                <Text style={styles.rewardEmoji}>🪙</Text>
                <Text style={styles.rewardNumber}>+{coins}</Text>
                <Text style={styles.rewardLabel}>Coins</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <GameButton
              title="🔄 Play Again"
              onPress={() => router.replace(`/game?mode=${mode}`)}
              variant="primary"
              size="large"
              style={styles.actionButton}
            />
            
            <GameButton
              title="🏠 Home"
              onPress={() => router.replace('/')}
              variant="secondary"
              size="large"
              style={styles.actionButton}
            />
            
            <GameButton
              title="📊 View Progress"
              onPress={() => router.push('/progress')}
              variant="success"
              size="medium"
              style={styles.actionButton}
            />
          </View>

          {/* Encouragement */}
          <View style={styles.encouragementContainer}>
            <Text style={styles.encouragementText}>
              {percentage >= 70 
                ? "You're on fire! Keep up the amazing work!" 
                : "Every practice session makes you stronger! 💪"}
            </Text>
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
  performanceContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  ringContent: {
    alignItems: 'center',
  },
  performanceEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  resultsCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textLight,
  },
  resultValue: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  rewardsCard: {
    marginBottom: 30,
  },
  rewardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rewardItem: {
    alignItems: 'center',
  },
  rewardEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  rewardNumber: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.success,
    marginBottom: 4,
  },
  rewardLabel: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textLight,
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 30,
  },
  actionButton: {
    width: '100%',
  },
  encouragementContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  encouragementText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
