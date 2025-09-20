
import { useState, useEffect } from 'react';
import { PlayerProgress, DailyMission, GameSession } from '../types/GameTypes';
import { generateDailyMissions, getRankFromStars } from '../data/gameData';

const STORAGE_KEYS = {
  PLAYER_PROGRESS: 'player_progress',
  DAILY_MISSIONS: 'daily_missions',
  LAST_MISSION_DATE: 'last_mission_date',
};

const defaultProgress: PlayerProgress = {
  level: 1,
  rank: 'Elite',
  totalStars: 0,
  totalCoins: 0,
  dailyStreak: 0,
  lastPlayDate: '',
  completedMissions: [],
  skillsProgress: {
    addition: 0,
    subtraction: 0,
    multiplication: 0,
    division: 0,
  },
};

export const useGameState = () => {
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(defaultProgress);
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      // In a real app, you'd load from AsyncStorage
      // For now, we'll use localStorage for web compatibility
      if (typeof window !== 'undefined') {
        const savedProgress = localStorage.getItem(STORAGE_KEYS.PLAYER_PROGRESS);
        const savedMissions = localStorage.getItem(STORAGE_KEYS.DAILY_MISSIONS);
        const lastMissionDate = localStorage.getItem(STORAGE_KEYS.LAST_MISSION_DATE);

        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          progress.rank = getRankFromStars(progress.totalStars);
          setPlayerProgress(progress);
        }

        // Check if we need new daily missions
        const today = new Date().toDateString();
        if (lastMissionDate !== today) {
          const newMissions = generateDailyMissions();
          setDailyMissions(newMissions);
          localStorage.setItem(STORAGE_KEYS.DAILY_MISSIONS, JSON.stringify(newMissions));
          localStorage.setItem(STORAGE_KEYS.LAST_MISSION_DATE, today);
        } else if (savedMissions) {
          setDailyMissions(JSON.parse(savedMissions));
        }
      }
    } catch (error) {
      console.log('Error loading game data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = (progress: PlayerProgress) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.PLAYER_PROGRESS, JSON.stringify(progress));
      }
      setPlayerProgress(progress);
    } catch (error) {
      console.log('Error saving progress:', error);
    }
  };

  const saveMissions = (missions: DailyMission[]) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.DAILY_MISSIONS, JSON.stringify(missions));
      }
      setDailyMissions(missions);
    } catch (error) {
      console.log('Error saving missions:', error);
    }
  };

  const updateProgress = (gameSession: GameSession) => {
    const newProgress = { ...playerProgress };
    
    // Add stars and coins based on performance
    const starsEarned = Math.floor((gameSession.correctAnswers / gameSession.totalQuestions) * 10);
    const coinsEarned = gameSession.correctAnswers * 5;
    
    newProgress.totalStars += starsEarned;
    newProgress.totalCoins += coinsEarned;
    newProgress.rank = getRankFromStars(newProgress.totalStars);
    
    // Update skill progress
    gameSession.questions.forEach(question => {
      if (newProgress.skillsProgress[question.operation] !== undefined) {
        newProgress.skillsProgress[question.operation] += 1;
      }
    });
    
    // Update daily streak
    const today = new Date().toDateString();
    if (newProgress.lastPlayDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (newProgress.lastPlayDate === yesterday.toDateString()) {
        newProgress.dailyStreak += 1;
      } else {
        newProgress.dailyStreak = 1;
      }
      
      newProgress.lastPlayDate = today;
    }
    
    saveProgress(newProgress);
    
    // Update daily missions progress
    updateMissionProgress(gameSession);
    
    return { starsEarned, coinsEarned };
  };

  const updateMissionProgress = (gameSession: GameSession) => {
    const updatedMissions = dailyMissions.map(mission => {
      if (mission.completed) return mission;
      
      let progressToAdd = 0;
      
      if (mission.operation) {
        // Count correct answers for specific operation
        progressToAdd = gameSession.questions.filter(
          q => q.operation === mission.operation
        ).length;
      } else {
        // General mission (any correct answers)
        progressToAdd = gameSession.correctAnswers;
      }
      
      const newProgress = Math.min(mission.progress + progressToAdd, mission.target);
      const completed = newProgress >= mission.target;
      
      if (completed && !mission.completed) {
        // Award mission rewards
        const newPlayerProgress = { ...playerProgress };
        newPlayerProgress.totalStars += mission.reward.stars;
        newPlayerProgress.totalCoins += mission.reward.coins;
        saveProgress(newPlayerProgress);
      }
      
      return {
        ...mission,
        progress: newProgress,
        completed,
      };
    });
    
    saveMissions(updatedMissions);
  };

  return {
    playerProgress,
    dailyMissions,
    isLoading,
    updateProgress,
    loadGameData,
  };
};
