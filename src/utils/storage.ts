import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizProgress, UserProgress } from '../types';

const PROGRESS_KEY = 'user_progress';
const QUIZ_PROGRESS_KEY = 'quiz_progress';

// Lưu tiến độ học của user
export const saveUserProgress = async (progress: UserProgress): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
};

// Lấy tiến độ học của user
export const getUserProgress = async (): Promise<UserProgress> => {
  try {
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting user progress:', error);
    return {};
  }
};

// Cập nhật mastery level của một từ
export const updateWordMastery = async (
  wordId: string,
  masteryLevel: number
): Promise<void> => {
  try {
    const progress = await getUserProgress();
    progress[wordId] = {
      masteryLevel,
      lastReviewed: new Date().toISOString(),
    };
    await saveUserProgress(progress);
  } catch (error) {
    console.error('Error updating word mastery:', error);
  }
};

// Cập nhật tiến độ từ dựa trên kết quả đúng/sai
export const updateWordProgress = async (
  wordId: string,
  correct: boolean
): Promise<void> => {
  try {
    const progress = await getUserProgress();
    const currentProgress = progress[wordId];
    
    let newMasteryLevel = 0;
    
    if (currentProgress) {
      // Nếu đúng: tăng mastery (tối đa 3)
      // Nếu sai: giảm mastery (tối thiểu 0)
      newMasteryLevel = correct 
        ? Math.min(currentProgress.masteryLevel + 1, 3)
        : Math.max(currentProgress.masteryLevel - 1, 0);
    } else {
      // Từ mới: nếu đúng = level 1, nếu sai = level 0
      newMasteryLevel = correct ? 1 : 0;
    }
    
    progress[wordId] = {
      masteryLevel: newMasteryLevel,
      lastReviewed: new Date().toISOString(),
    };
    
    await saveUserProgress(progress);
  } catch (error) {
    console.error('Error updating word progress:', error);
  }
};

// Lấy tiến độ của một từ cụ thể
export const getWordProgress = async (wordId: string) => {
  try {
    const progress = await getUserProgress();
    return progress[wordId] || null;
  } catch (error) {
    console.error('Error getting word progress:', error);
    return null;
  }
};


// Lưu tiến độ quiz cho một level
export const saveQuizProgress = async (
  level: number,
  progress: QuizProgress
): Promise<void> => {
  try {
    const allProgress = await getQuizProgress();
    allProgress[level] = progress;
    await AsyncStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Error saving quiz progress:', error);
  }
};

// Lấy tiến độ quiz
export const getQuizProgress = async (): Promise<{ [level: number]: QuizProgress }> => {
  try {
    const data = await AsyncStorage.getItem(QUIZ_PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting quiz progress:', error);
    return {};
  }
};

// Reset tiến độ quiz cho một level
export const resetQuizProgress = async (level: number): Promise<void> => {
  try {
    const allProgress = await getQuizProgress();
    delete allProgress[level];
    await AsyncStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Error resetting quiz progress:', error);
  }
};

// Reset tất cả mastery levels về 0
export const resetAllMastery = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify({}));
  } catch (error) {
    console.error('Error resetting all mastery:', error);
  }
};

// Lấy thống kê theo level
export const getLevelStats = async (level: number, totalWords: number) => {
  const progress = await getUserProgress();
  const stats = {
    new: 0,
    familiar: 0,
    known: 0,
    mastered: 0,
  };

  Object.values(progress).forEach((word) => {
    switch (word.masteryLevel) {
      case 0:
        stats.new++;
        break;
      case 1:
        stats.familiar++;
        break;
      case 2:
        stats.known++;
        break;
      case 3:
        stats.mastered++;
        break;
    }
  });

  // Từ chưa học = tổng - đã học
  const learned = stats.familiar + stats.known + stats.mastered;
  stats.new = totalWords - learned;

  return stats;
};
