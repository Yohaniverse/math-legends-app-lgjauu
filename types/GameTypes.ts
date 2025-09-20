
export interface Question {
  id: string;
  question: string;
  answer: number;
  options: number[];
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  difficulty: number;
}

export interface GameSession {
  id: string;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  startTime: Date;
  endTime?: Date;
  mode: GameMode;
}

export type GameMode = 'learning' | 'challenge' | 'adventure';

export interface PlayerProgress {
  level: number;
  rank: PlayerRank;
  totalStars: number;
  totalCoins: number;
  dailyStreak: number;
  lastPlayDate: string;
  completedMissions: string[];
  skillsProgress: {
    addition: number;
    subtraction: number;
    multiplication: number;
    division: number;
  };
}

export type PlayerRank = 'Elite' | 'Master' | 'Grandmaster' | 'Epic' | 'Legend' | 'Mythic';

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: {
    stars: number;
    coins: number;
  };
  completed: boolean;
  operation?: 'addition' | 'subtraction' | 'multiplication' | 'division';
}

export interface Character {
  id: string;
  name: string;
  avatar: string;
  encouragementMessages: string[];
  hintMessages: string[];
}
