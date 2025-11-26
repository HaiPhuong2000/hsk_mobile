export interface Example {
  chinese: string;    // Chinese sentence
  pinyin: string;     // Pinyin of the sentence
  vietnamese: string; // Vietnamese translation
}

export interface VocabWord {
  id: string;
  hanzi: string;
  pinyin: string;
  translations: string[];
  level: number;
  examples?: Example[]; // Example sentences
  masteryLevel?: number; // 0 = Mới, 1 = Hơi nhớ, 2 = Quen thuộc, 3 = Nhớ sâu
  lastReviewed?: string; // ISO date
}

export interface QuizProgress {
  level: number;
  currentIndex: number;
  totalWords: number;
  stats: {
    new: number;        // masteryLevel = 0
    familiar: number;   // masteryLevel = 1
    known: number;      // masteryLevel = 2
    mastered: number;   // masteryLevel = 3
  };
}

export interface UserProgress {
  [wordId: string]: {
    masteryLevel: number;
    lastReviewed: string;
  };
}
