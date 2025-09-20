
import { Question, DailyMission, Character, PlayerRank } from '../types/GameTypes';

export const generateQuestion = (operation: 'addition' | 'subtraction' | 'multiplication' | 'division', difficulty: number): Question => {
  let num1: number, num2: number, answer: number;
  
  switch (operation) {
    case 'addition':
      num1 = Math.floor(Math.random() * (difficulty * 10)) + 1;
      num2 = Math.floor(Math.random() * (difficulty * 10)) + 1;
      answer = num1 + num2;
      break;
    case 'subtraction':
      num1 = Math.floor(Math.random() * (difficulty * 10)) + difficulty * 5;
      num2 = Math.floor(Math.random() * num1) + 1;
      answer = num1 - num2;
      break;
    case 'multiplication':
      num1 = Math.floor(Math.random() * difficulty) + 1;
      num2 = Math.floor(Math.random() * difficulty) + 1;
      answer = num1 * num2;
      break;
    case 'division':
      answer = Math.floor(Math.random() * difficulty) + 1;
      num2 = Math.floor(Math.random() * difficulty) + 1;
      num1 = answer * num2;
      break;
    default:
      num1 = 1;
      num2 = 1;
      answer = 2;
  }

  const wrongAnswers = generateWrongAnswers(answer, 3);
  const options = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);

  return {
    id: Math.random().toString(36).substr(2, 9),
    question: `${num1} ${getOperationSymbol(operation)} ${num2} = ?`,
    answer,
    options,
    operation,
    difficulty,
  };
};

const getOperationSymbol = (operation: string): string => {
  switch (operation) {
    case 'addition': return '+';
    case 'subtraction': return '-';
    case 'multiplication': return '×';
    case 'division': return '÷';
    default: return '+';
  }
};

const generateWrongAnswers = (correctAnswer: number, count: number): number[] => {
  const wrongAnswers: number[] = [];
  const range = Math.max(5, Math.floor(correctAnswer * 0.5));
  
  while (wrongAnswers.length < count) {
    const wrong = correctAnswer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * range) + 1);
    if (wrong > 0 && wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
      wrongAnswers.push(wrong);
    }
  }
  
  return wrongAnswers;
};

export const generateDailyMissions = (): DailyMission[] => {
  const operations: Array<'addition' | 'subtraction' | 'multiplication' | 'division'> = ['addition', 'subtraction', 'multiplication', 'division'];
  const missions: DailyMission[] = [];

  // Generate 3 daily missions
  for (let i = 0; i < 3; i++) {
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const target = Math.floor(Math.random() * 10) + 5; // 5-15 questions
    
    missions.push({
      id: `mission_${i}_${Date.now()}`,
      title: `${operation.charAt(0).toUpperCase() + operation.slice(1)} Master`,
      description: `Solve ${target} ${operation} problems correctly`,
      target,
      progress: 0,
      reward: {
        stars: target * 2,
        coins: target * 5,
      },
      completed: false,
      operation,
    });
  }

  return missions;
};

export const mathCharacter: Character = {
  id: 'math_buddy',
  name: 'Math Buddy',
  avatar: '🤖',
  encouragementMessages: [
    "Great job! You're getting better!",
    "Awesome work! Keep it up!",
    "You're a math star! ⭐",
    "Fantastic! You're on fire! 🔥",
    "Amazing! You're so smart!",
    "Wonderful! Keep going!",
    "Excellent! You're doing great!",
    "Super! You're a math champion!",
  ],
  hintMessages: [
    "Take your time and think carefully!",
    "Try counting on your fingers if it helps!",
    "Break the problem into smaller parts!",
    "Remember what you learned before!",
    "You can do this! I believe in you!",
    "Think step by step!",
    "Don't worry, practice makes perfect!",
  ],
};

export const rankThresholds: Record<PlayerRank, number> = {
  'Elite': 0,
  'Master': 100,
  'Grandmaster': 300,
  'Epic': 600,
  'Legend': 1000,
  'Mythic': 1500,
};

export const getRankFromStars = (stars: number): PlayerRank => {
  const ranks: PlayerRank[] = ['Mythic', 'Legend', 'Epic', 'Grandmaster', 'Master', 'Elite'];
  
  for (const rank of ranks) {
    if (stars >= rankThresholds[rank]) {
      return rank;
    }
  }
  
  return 'Elite';
};

export const getRankEmoji = (rank: PlayerRank): string => {
  switch (rank) {
    case 'Elite': return '🥉';
    case 'Master': return '🥈';
    case 'Grandmaster': return '🥇';
    case 'Epic': return '💎';
    case 'Legend': return '👑';
    case 'Mythic': return '🏆';
    default: return '🥉';
  }
};
