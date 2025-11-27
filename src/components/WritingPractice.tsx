import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { VocabWord } from '../types';
import { HanziWriterNative } from './HanziWriterNative';

interface WritingPracticeProps {
  words: VocabWord[];
  onComplete: (results: { wordId: string; correct: boolean }[]) => void;
}

export const WritingPractice: React.FC<WritingPracticeProps> = ({ words, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{ wordId: string; correct: boolean }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState<boolean | null>(null);

  const [completedChars, setCompletedChars] = useState<Set<string>>(new Set());

  const currentWord = words[currentIndex];
  const isLastWord = currentIndex === words.length - 1;

  const uniqueChars = useMemo(() => {
    return Array.from(new Set(currentWord.hanzi.split('')));
  }, [currentWord]);

  const handleCharComplete = (char: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setCompletedChars(prev => {
      const next = new Set(prev);
      next.add(char);
      
      // Check if all characters are complete
      if (next.size === uniqueChars.length) {
        setCurrentResult(true);
        setResults(prevResults => [...prevResults, { wordId: currentWord.id, correct: true }]);
        setShowResult(true);
      }
      
      return next;
    });
  };

  const handleMistake = () => {
    // Stroke mistake
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const handleNext = () => {
    if (isLastWord) {
      onComplete(results);
    } else {
      setCurrentIndex(prev => prev + 1);
      setShowResult(false);
      setCurrentResult(null);
      setCompletedChars(new Set());
    }
  };

  const handleSkip = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setResults(prev => [...prev, { wordId: currentWord.id, correct: false }]);
    handleNext();
  };

  if (currentIndex >= words.length) {
    const correctCount = results.filter(r => r.correct).length;
    const accuracy = (correctCount / words.length) * 100;

    return (
      <View className="flex-1 bg-dark-900 items-center justify-center p-6">
        <View className="bg-dark-800/90 rounded-3xl p-8 items-center border border-primary-500/30">
          <Ionicons name="ribbon" size={80} color="#a78bfa" />
          <Text className="text-white text-3xl font-bold mt-4 mb-2">Hoàn thành!</Text>
          <Text className="text-primary-300 text-xl mb-6">
            Đúng: {correctCount}/{words.length}
          </Text>
          <Text className="text-dark-300 text-lg mb-4">
            Độ chính xác: {accuracy.toFixed(0)}%
          </Text>
          <View className="flex-row gap-4 mt-4">
            {results.map((result, index) => (
              <View
                key={index}
                className={`w-3 h-3 rounded-full ${
                  result.correct ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-dark-900" contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View className="px-4 py-4 border-b border-white/10">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white text-xl font-bold">Luyện viết chữ</Text>
          <View className="bg-primary-500/20 px-4 py-2 rounded-full border border-primary-500/30">
            <Text className="text-primary-300 font-semibold">
              {currentIndex + 1}/{words.length}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-1 mt-2">
          {words.map((_, index) => (
            <View
              key={index}
              className={`flex-1 h-1 rounded-full ${
                index < currentIndex
                  ? 'bg-green-500'
                  : index === currentIndex
                  ? 'bg-primary-500'
                  : 'bg-dark-700'
              }`}
            />
          ))}
        </View>
      </View>

      {/* Word to Write */}
      <View className="px-4 py-6">
        <View className="bg-dark-800/60 rounded-2xl p-6 mb-6">
          <Text className="text-dark-400 text-sm uppercase font-semibold mb-2">
            Hãy viết chữ có nghĩa:
          </Text>
          <Text className="text-white text-2xl font-bold mb-2">
            {currentWord.translations[0]}
          </Text>
          <Text className="text-primary-300 text-lg">{currentWord.pinyin}</Text>
        </View>

        {/* Writing Canvas */}
        {uniqueChars.map((char, index) => (
          <View key={index} className="bg-dark-800/60 rounded-2xl p-4 mb-6">
            <Text className="text-primary-400 text-sm font-bold mb-2 uppercase tracking-wider">
              Chữ {char}
            </Text>
            <HanziWriterNative
              character={char}
              mode="quiz"
              onComplete={() => handleCharComplete(char)}
              onMistake={handleMistake}
            />
          </View>
        ))}

        {/* Result Feedback */}
        {showResult && currentResult && (
          <View className="mt-4 bg-green-500/20 border border-green-500 rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text className="text-green-400 text-lg font-bold">Chính xác!</Text>
            </View>
            <Text className="text-white text-xl font-bold">{currentWord.hanzi}</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View className="px-4 pb-8 gap-3">
        {showResult ? (
          <TouchableOpacity
            onPress={handleNext}
            className="bg-primary-500 py-4 rounded-2xl flex-row items-center justify-center gap-2"
          >
            <Text className="text-white font-bold text-lg">
              {isLastWord ? 'Hoàn thành' : 'Từ tiếp theo'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSkip}
            className="bg-dark-700 py-4 rounded-2xl flex-row items-center justify-center gap-2"
          >
            <Text className="text-dark-300 font-bold text-lg">Bỏ qua</Text>
            <Ionicons name="arrow-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};
