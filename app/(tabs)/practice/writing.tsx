import { WritingPractice } from '@/src/components/WritingPractice';
import { getVocabByLevel } from '@/src/data';
import { updateWordProgress } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function WritingScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleComplete = async (results: { wordId: string; correct: boolean }[]) => {
    // Update progress for each word
    for (const result of results) {
      await updateWordProgress(result.wordId, result.correct);
    }
    setCompleted(true);
  };

  const handleRestart = () => {
    setCompleted(false);
    setSelectedLevel(null);
  };

  if (completed) {
    return (
      <View className="flex-1 bg-dark-900 items-center justify-center p-6">
        <View className="bg-dark-800/90 rounded-3xl p-8 items-center border border-primary-500/30">
          <Ionicons name="ribbon" size={80} color="#a78bfa" />
          <Text className="text-white text-3xl font-bold mt-4 mb-2">
            Hoàn thành!
          </Text>
          <Text className="text-dark-300 text-lg mb-6">
            Tiến độ đã được cập nhật
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleRestart}
              className="bg-primary-500 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-semibold">Làm lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-dark-700 px-6 py-3 rounded-xl"
            >
              <Text className="text-dark-300 font-semibold">Quay lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (!selectedLevel) {
    return (
      <View className="flex-1 bg-dark-900 p-4">
        <View className="mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center gap-2 mb-4"
          >
            <Ionicons name="arrow-back" size={24} color="#a5b4fc" />
            <Text className="text-primary-300 text-lg">Quay lại</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-white mb-3 text-center mt-4">
            Chọn cấp độ HSK
          </Text>
          <Text className="text-dark-300 text-center mb-8">
            Chọn cấp độ để bắt đầu luyện viết chữ
          </Text>
        </View>
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          numColumns={2}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedLevel(item)}
              className="flex-1 m-2 bg-dark-800/80 backdrop-blur-lg border border-purple-500/30 p-8 rounded-2xl shadow-lg items-center active:bg-dark-800"
            >
              <Text className="text-3xl font-bold text-purple-400 mb-2">HSK {item}</Text>
              <Text className="text-dark-300 text-sm">
                {getVocabByLevel(item).length} từ
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  const words = getVocabByLevel(selectedLevel).slice(0, 5); // Limit to 5 words per session (writing takes longer)

  return <WritingPractice words={words} onComplete={handleComplete} />;
}
