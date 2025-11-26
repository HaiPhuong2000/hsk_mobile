import { Flashcard } from '@/src/components/Flashcard';
import { getVocabByLevel } from '@/src/data';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { useRouter } from 'expo-router';

export default function FlashcardsScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledData, setShuffledData] = useState<any[]>([]);

  useEffect(() => {
    if (selectedLevel) {
      const data = getVocabByLevel(selectedLevel);
      setShuffledData([...data].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
    }
  }, [selectedLevel]);

  const handleNext = () => {
    if (currentIndex < shuffledData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reset or finish
      setCurrentIndex(0);
    }
  };

  if (!selectedLevel) {
    return (
      <View className="flex-1 bg-dark-900 p-4">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 bg-dark-800/80 p-3 rounded-full border border-white/10">
            <Ionicons name="arrow-back" size={24} color="#a5b4fc" />
          </TouchableOpacity>
        </View>
        <Text className="text-3xl font-bold text-white mb-3 text-center">
          Thẻ ghi nhớ
        </Text>
        <Text className="text-dark-300 text-center mb-8">
          Chọn cấp độ để bắt đầu học từ vựng
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

  const currentWord = shuffledData[currentIndex];

  if (!currentWord) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Không có từ nào cho cấp độ này.</Text>
        <TouchableOpacity onPress={() => setSelectedLevel(null)} className="mt-4">
          <Text className="text-blue-500">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-900 p-4 items-center justify-center">
      <View className="flex-row w-full justify-between items-center mb-6 px-4">
        <TouchableOpacity onPress={() => setSelectedLevel(null)} className="bg-dark-800/80 p-3 rounded-full border border-white/10">
          <Ionicons name="arrow-back" size={24} color="#a5b4fc" />
        </TouchableOpacity>
        <Text className="text-dark-300 text-lg">
          Cấp độ {selectedLevel} • {currentIndex + 1} / {shuffledData.length}
        </Text>
        <View style={{ width: 48 }} />
      </View>
      
      <Flashcard
        hanzi={currentWord.hanzi}
        pinyin={currentWord.pinyin}
        translations={currentWord.translations}
        examples={currentWord.examples}
        onNext={handleNext}
      />
    </View>
  );
}
