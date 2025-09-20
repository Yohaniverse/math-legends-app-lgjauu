
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, fonts } from '../styles/commonStyles';
import { useGameState } from '../hooks/useGameState';
import { generateQuestion, mathCharacter } from '../data/gameData';
import { Question, GameSession, GameMode } from '../types/GameTypes';
import CharacterAvatar from '../components/CharacterAvatar';
import GameButton from '../components/GameButton';
import ProgressRing from '../components/ProgressRing';

export default function GameScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const { updateProgress } = useGameState();
  
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [characterMessage, setCharacterMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    initializeGame();
  }, [mode]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft !== null && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, showResult]);

  const initializeGame = () => {
    const gameMode = (mode as GameMode) || 'learning';
    const questionCount = gameMode === 'challenge' ? 10 : 5;
    const questions = generateGameQuestions(gameMode, questionCount);
    
    const session: GameSession = {
      id: Math.random().toString(36).substr(2, 9),
      questions,
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      totalQuestions: questionCount,
      startTime: new Date(),
      mode: gameMode,
    };
    
    setGameSession(session);
    setCurrentQuestion(questions[0]);
    setCharacterMessage(getWelcomeMessage(gameMode));
    
    // Set timer for challenge mode
    if (gameMode === 'challenge') {
      setTimeLeft(30); // 30 seconds per question
    }
  };

  const generateGameQuestions = (gameMode: GameMode, count: number): Question[] => {
    const questions: Question[] = [];
    const operations: Array<'addition' | 'subtraction' | 'multiplication' | 'division'> = 
      ['addition', 'subtraction', 'multiplication', 'division'];
    
    for (let i = 0; i < count; i++) {
      const operation = operations[Math.floor(Math.random() * operations.length)];
      const difficulty = gameMode === 'challenge' ? Math.floor(Math.random() * 3) + 2 : 1;
      questions.push(generateQuestion(operation, difficulty));
    }
    
    return questions;
  };

  const getWelcomeMessage = (gameMode: GameMode): string => {
    switch (gameMode) {
      case 'learning':
        return "Let's learn together! Take your time and think carefully.";
      case 'challenge':
        return "Challenge mode activated! You have 30 seconds per question!";
      case 'adventure':
        return "Welcome to Math Adventure! Let's explore the world of numbers!";
      default:
        return "Ready to solve some math problems?";
    }
  };

  const handleAnswerSelect = (answer: number) => {
    if (showResult || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);
    setShowResult(true);
    
    // Update game session
    if (gameSession) {
      const updatedSession = {
        ...gameSession,
        correctAnswers: correct ? gameSession.correctAnswers + 1 : gameSession.correctAnswers,
        score: correct ? gameSession.score + (timeLeft || 10) : gameSession.score,
      };
      setGameSession(updatedSession);
    }
    
    // Set character message
    if (correct) {
      const messages = mathCharacter.encouragementMessages;
      setCharacterMessage(messages[Math.floor(Math.random() * messages.length)]);
    } else {
      const hints = mathCharacter.hintMessages;
      setCharacterMessage(hints[Math.floor(Math.random() * hints.length)]);
    }
  };

  const handleTimeUp = () => {
    if (!showResult && currentQuestion) {
      setSelectedAnswer(null);
      setIsCorrect(false);
      setShowResult(true);
      setCharacterMessage("Time's up! Don't worry, keep practicing!");
    }
  };

  const handleNextQuestion = () => {
    if (!gameSession) return;
    
    const nextIndex = gameSession.currentQuestionIndex + 1;
    
    if (nextIndex >= gameSession.questions.length) {
      // Game finished
      finishGame();
    } else {
      // Next question
      setGameSession({
        ...gameSession,
        currentQuestionIndex: nextIndex,
      });
      setCurrentQuestion(gameSession.questions[nextIndex]);
      setSelectedAnswer(null);
      setShowResult(false);
      setCharacterMessage('');
      
      // Reset timer for challenge mode
      if (gameSession.mode === 'challenge') {
        setTimeLeft(30);
      }
    }
  };

  const finishGame = () => {
    if (!gameSession) return;
    
    const finalSession = {
      ...gameSession,
      endTime: new Date(),
    };
    
    const rewards = updateProgress(finalSession);
    
    // Navigate to results screen
    router.replace({
      pathname: '/results',
      params: {
        correctAnswers: finalSession.correctAnswers.toString(),
        totalQuestions: finalSession.totalQuestions.toString(),
        starsEarned: rewards.starsEarned.toString(),
        coinsEarned: rewards.coinsEarned.toString(),
        mode: finalSession.mode,
      },
    });
  };

  const handleQuit = () => {
    Alert.alert(
      'Quit Game?',
      'Are you sure you want to quit? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  if (!gameSession || !currentQuestion) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.title}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = ((gameSession.currentQuestionIndex + 1) / gameSession.totalQuestions) * 100;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={styles.header}>
          <GameButton
            title="← Quit"
            onPress={handleQuit}
            variant="secondary"
            size="small"
            style={styles.quitButton}
          />
          
          <View style={styles.progressContainer}>
            <ProgressRing 
              progress={progress}
              size={60}
              showPercentage={false}
            >
              <Text style={styles.progressText}>
                {gameSession.currentQuestionIndex + 1}/{gameSession.totalQuestions}
              </Text>
            </ProgressRing>
          </View>
          
          {timeLeft !== null && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>⏰ {timeLeft}s</Text>
            </View>
          )}
        </View>

        {/* Character */}
        <CharacterAvatar 
          size={80}
          showMessage={characterMessage.length > 0}
          message={characterMessage}
        />

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {/* Answer Options */}
        <View style={styles.answersContainer}>
          {currentQuestion.options.map((option, index) => {
            let buttonVariant: 'answer' | 'success' | 'primary' = 'answer';
            
            if (showResult) {
              if (option === currentQuestion.answer) {
                buttonVariant = 'success';
              } else if (option === selectedAnswer && !isCorrect) {
                buttonVariant = 'primary';
              }
            }
            
            return (
              <GameButton
                key={index}
                title={option.toString()}
                onPress={() => handleAnswerSelect(option)}
                variant={buttonVariant}
                disabled={showResult}
                style={styles.answerButton}
              />
            );
          })}
        </View>

        {/* Next Button */}
        {showResult && (
          <View style={styles.nextContainer}>
            <GameButton
              title={gameSession.currentQuestionIndex + 1 >= gameSession.totalQuestions ? 'Finish' : 'Next →'}
              onPress={handleNextQuestion}
              variant="primary"
              size="large"
            />
          </View>
        )}

        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            Score: {gameSession.correctAnswers}/{gameSession.totalQuestions}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quitButton: {
    backgroundColor: colors.textLight,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  timerContainer: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  timerText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  questionContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    padding: 30,
    marginVertical: 30,
    alignItems: 'center',
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 3,
  },
  questionText: {
    fontSize: 32,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
  },
  answersContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  answerButton: {
    marginVertical: 8,
  },
  nextContainer: {
    marginVertical: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textLight,
  },
});
