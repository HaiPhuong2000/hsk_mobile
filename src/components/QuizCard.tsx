import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface QuizCardProps {
  hanzi: string;
  pinyin: string;
  options: string[];
  correctAnswer: string;
  onAnswer: (answer: string) => void;
  selectedAnswer?: string;
  showResult: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  hanzi,
  pinyin,
  options,
  correctAnswer,
  onAnswer,
  selectedAnswer,
  showResult,
}) => {
  const handleSpeak = () => {
    Speech.speak(hanzi, {
      language: 'zh-CN',
      pitch: 1.0,
      rate: 0.75,
    });
  };

  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option
        ? 'bg-primary-500/30 border-primary-500'
        : 'bg-dark-800/80 border-white/10';
    }

    if (option === correctAnswer) {
      return 'bg-green-500/30 border-green-500';
    }

    if (selectedAnswer === option && option !== correctAnswer) {
      return 'bg-red-500/30 border-red-500';
    }

    return 'bg-dark-800/60 border-white/10';
  };

  const getOptionTextStyle = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option ? 'text-primary-300' : 'text-white';
    }

    if (option === correctAnswer) {
      return 'text-green-300';
    }

    if (selectedAnswer === option && option !== correctAnswer) {
      return 'text-red-300';
    }

    return 'text-dark-300';
  };

  return (
    <View className="w-full">
      {/* Question Card */}
      <View className="bg-dark-800/90 backdrop-blur-lg border-2 border-primary-500/30 rounded-3xl p-8 mb-6 items-center shadow-2xl">
        <Text className="text-7xl font-bold text-white mb-3">{hanzi}</Text>
        <Text className="text-2xl text-primary-300 mb-4">{pinyin}</Text>
        <TouchableOpacity
          onPress={handleSpeak}
          className="bg-primary-500/20 p-4 rounded-full border border-primary-500/30 active:bg-primary-500/30"
        >
          <Ionicons name="volume-high" size={28} color="#a5b4fc" />
        </TouchableOpacity>
      </View>

      {/* Options */}
      <View className="gap-4">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => !showResult && onAnswer(option)}
            disabled={showResult}
            className={`w-full p-5 rounded-2xl border-2 backdrop-blur-lg shadow-lg ${getOptionStyle(option)}`}
          >
            <Text className={`text-lg font-semibold text-center ${getOptionTextStyle(option)}`}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Button - chỉ hiện khi sai */}
      {showResult && selectedAnswer !== correctAnswer && (
        <TouchableOpacity
          onPress={() => onAnswer(correctAnswer)} // Trigger next
          className="mt-6 bg-primary-500 px-8 py-4 rounded-2xl shadow-lg active:bg-primary-600"
        >
          <Text className="text-white font-bold text-lg text-center">Câu tiếp theo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
