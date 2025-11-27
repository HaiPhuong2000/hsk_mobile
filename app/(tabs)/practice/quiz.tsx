import { ProgressStats } from '@/src/components/ProgressStats';
import { QuizCard } from '@/src/components/QuizCard';
import { getVocabByLevel } from '@/src/data';
import {
    getLevelStats,
    getQuizProgress,
    getUserProgress,
    resetQuizProgress,
    saveQuizProgress,
    updateWordMastery,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function QuizScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [vocabData, setVocabData] = useState<any[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState({
    new: 0,
    familiar: 0,
    known: 0,
    mastered: 0,
  });

  useEffect(() => {
    if (selectedLevel) {
      loadQuizData(selectedLevel);
    }
  }, [selectedLevel]);

  const loadQuizData = async (level: number) => {
    const data = getVocabByLevel(level);
    setVocabData(data);

    // Load progress
    const progress = await getQuizProgress();
    const levelProgress = progress[level];

    if (levelProgress) {
      setCurrentIndex(levelProgress.currentIndex);
      setStats(levelProgress.stats);
    } else {
      setCurrentIndex(0);
      const initialStats = await getLevelStats(level, data.length);
      setStats(initialStats);
    }
  };

  const generateOptions = (correctAnswer: string, allWords: any[]) => {
    const options = [correctAnswer];
    const otherWords = allWords.filter(w => !w.translations.includes(correctAnswer));

    while (options.length < 4 && otherWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherWords.length);
      const randomWord = otherWords[randomIndex];
      const randomTranslation = randomWord.translations[0];

      if (!options.includes(randomTranslation)) {
        options.push(randomTranslation);
      }
      otherWords.splice(randomIndex, 1);
    }

    return options.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = async (answer: string) => {
    if (showResult) {
      // Đây là lần nhấn "Câu tiếp theo" sau khi sai
      handleNext();
      return;
    }

    setSelectedAnswer(answer);
    setShowResult(true);

    const currentWord = vocabData[currentIndex];
    const isCorrect = currentWord.translations.includes(answer);

    if (isCorrect) {
      setScore(score + 1);

      // Update mastery level
      const progress = await getUserProgress();
      const wordProgress = progress[currentWord.id];
      const currentMastery = wordProgress?.masteryLevel ?? 0;
      const newMastery = Math.min(currentMastery + 1, 3);

      await updateWordMastery(currentWord.id, newMastery);

      // Update stats
      const newStats = { ...stats };
      if (currentMastery === 0) newStats.new--;
      if (newMastery === 1) newStats.familiar++;
      if (newMastery === 2) {
        newStats.familiar--;
        newStats.known++;
      }
      if (newMastery === 3) {
        newStats.known--;
        newStats.mastered++;
      }
      setStats(newStats);

      // Tự động chuyển câu khi đúng
      setTimeout(() => {
        handleNext();
      }, 1000);
    } else {
      // Reset to 0 if wrong
      await updateWordMastery(currentWord.id, 0);

      // Update stats
      const progress = await getUserProgress();
      const wordProgress = progress[currentWord.id];
      const oldMastery = wordProgress?.masteryLevel ?? 0;

      if (oldMastery > 0) {
        const newStats = { ...stats };
        newStats.new++;
        if (oldMastery === 1) newStats.familiar--;
        if (oldMastery === 2) newStats.known--;
        if (oldMastery === 3) newStats.mastered--;
        setStats(newStats);
      }

      // Không tự động chuyển câu khi sai - chờ người dùng nhấn "Câu tiếp theo"
    }
  };

  const handleNext = async () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < vocabData.length) {
      setCurrentIndex(nextIndex);
      setSelectedAnswer(undefined);
      setShowResult(false);

      // Save progress
      if (selectedLevel) {
        await saveQuizProgress(selectedLevel, {
          level: selectedLevel,
          currentIndex: nextIndex,
          totalWords: vocabData.length,
          stats,
        });
      }
    } else {
      // Quiz completed
      Alert.alert(
        'Hoàn thành!',
        `Bạn đã hoàn thành ${vocabData.length} từ!\nĐiểm: ${score}/${vocabData.length}`,
        [
          {
            text: 'Học lại',
            onPress: () => handleReset(),
          },
          {
            text: 'Quay lại',
            onPress: () => setSelectedLevel(null),
          },
        ]
      );
    }
  };

  const handleReset = async () => {
    if (selectedLevel) {
      Alert.alert(
        'Xác nhận',
        'Bạn có chắc muốn học lại từ đầu? Tiến độ sẽ bị reset.',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Đồng ý',
            onPress: async () => {
              await resetQuizProgress(selectedLevel);
              setCurrentIndex(0);
              setScore(0);
              setSelectedAnswer(undefined);
              setShowResult(false);
              const initialStats = await getLevelStats(selectedLevel, vocabData.length);
              setStats(initialStats);
            },
          },
        ]
      );
    }
  };

  const currentWord = vocabData[currentIndex];
  
  const options = useMemo(() => {
    if (!currentWord) return [];
    return generateOptions(currentWord.translations[0], vocabData);
  }, [currentWord, vocabData]);

  if (!selectedLevel) {
    return (
      <View className="flex-1 bg-dark-900 p-4">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 bg-dark-800/80 p-3 rounded-full border border-white/10">
            <Ionicons name="arrow-back" size={24} color="#a5b4fc" />
          </TouchableOpacity>
        </View>
        <Text className="text-3xl font-bold text-white mb-3 text-center">
          Trắc nghiệm
        </Text>
        <Text className="text-dark-300 text-center mb-8">
          Chọn cấp độ để bắt đầu trắc nghiệm
        </Text>
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          numColumns={2}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedLevel(item)}
              className="flex-1 m-2 bg-dark-800/80 backdrop-blur-lg border border-primary-500/30 p-8 rounded-2xl shadow-lg items-center active:bg-dark-800"
            >
              <Text className="text-3xl font-bold text-primary-400 mb-2">HSK {item}</Text>
              <Text className="text-dark-300 text-sm">
                {getVocabByLevel(item).length} từ
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  if (vocabData.length === 0) {
    return (
      <View className="flex-1 bg-dark-900 items-center justify-center">
        <Text className="text-white">Đang tải...</Text>
      </View>
    );
  }



  return (
    <ScrollView className="flex-1 bg-dark-900" contentContainerStyle={{ padding: 16 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          onPress={() => setSelectedLevel(null)}
          className="bg-dark-800/80 p-3 rounded-full border border-white/10"
        >
          <Ionicons name="arrow-back" size={24} color="#a5b4fc" />
        </TouchableOpacity>
        <View className="flex-1 mx-4">
          <Text className="text-white text-lg font-bold text-center">
            Câu hỏi {currentIndex + 1} / {vocabData.length}
          </Text>
          <Text className="text-primary-400 text-sm text-center">Điểm: {score}</Text>
        </View>
        <TouchableOpacity
          onPress={handleReset}
          className="bg-dark-800/80 p-3 rounded-full border border-white/10"
        >
          <Ionicons name="refresh" size={24} color="#a5b4fc" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <ProgressStats stats={stats} />

      {/* Quiz Card */}
      <QuizCard
        hanzi={currentWord.hanzi}
        pinyin={currentWord.pinyin}
        options={options}
        correctAnswer={currentWord.translations[0]}
        onAnswer={handleAnswer}
        selectedAnswer={selectedAnswer}
        showResult={showResult}
      />
    </ScrollView>
  );
}
