import { HanziWriter } from '@/src/components/HanziWriter';
import { getVocabByLevel } from '@/src/data';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function WritingScreen() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [showOutline, setShowOutline] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [vocabData, setVocabData] = useState<any[]>([]);

  useEffect(() => {
    if (selectedLevel) {
      setVocabData(getVocabByLevel(selectedLevel));
      setCurrentIndex(0);
    }
  }, [selectedLevel]);

  const handleNext = () => {
    setFeedback('');
    if (currentIndex < vocabData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleCorrect = () => {
    setFeedback('Correct! Great job!');
  };

  const handleMistake = () => {
    setFeedback('Oops! Try again.');
  };

  if (!selectedLevel) {
    return (
      <View className="flex-1 bg-dark-900 p-4">
        <Text className="text-3xl font-bold text-white mb-3 text-center mt-10">
          Chọn cấp độ luyện tập
        </Text>
        <Text className="text-dark-300 text-center mb-8">
          Chọn cấp độ để luyện viết
        </Text>
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

  const currentWord = vocabData[currentIndex];
  if (!currentWord) return null;
  
  // HanziWriter works best with single characters. 
  // For multi-char words, we might need multiple writers or just pick the first char for now.
  // Let's just pick the first character of the word for simplicity in this MVP.
  const charToPractice = currentWord.hanzi.charAt(0);

  return (
    <View className="flex-1 bg-dark-900 p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => setSelectedLevel(null)} className="mr-4 bg-dark-800/80 p-3 rounded-full border border-white/10">
          <Ionicons name="arrow-back" size={24} color="#a5b4fc" />
        </TouchableOpacity>
        <View className="flex-1 flex-row justify-between items-center bg-dark-800/80 backdrop-blur-lg border border-white/10 p-4 rounded-2xl shadow-lg">
          <View>
            <Text className="text-xl font-bold text-white">{currentWord.hanzi}</Text>
            <Text className="text-primary-300">{currentWord.pinyin}</Text>
          </View>
          <View>
            <Text className="text-dark-300 text-right text-sm">Cấp độ {currentWord.level}</Text>
            <Text className="text-dark-400 text-xs text-right">Ký tự: {charToPractice}</Text>
          </View>
        </View>
      </View>

      <View className="h-80 w-full bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden mb-4 border border-slate-200 dark:border-slate-700">
        <HanziWriter 
          key={`${charToPractice}-${isQuizMode}-${showOutline}`} // Force re-render on mode change
          character={charToPractice}
          mode={isQuizMode ? 'quiz' : 'animate'}
          showOutline={showOutline}
          onCorrect={handleCorrect}
          onMistake={handleMistake}
        />
      </View>

      {feedback ? (
        <Text className={`text-center text-lg font-bold mb-4 ${feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'}`}>
          {feedback}
        </Text>
      ) : <View className="h-7" />}

      <View className="bg-dark-800/80 backdrop-blur-lg border border-white/10 p-5 rounded-2xl shadow-lg mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white font-semibold">Chế độ kiểm tra</Text>
          <Switch value={isQuizMode} onValueChange={setIsQuizMode} />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-white font-semibold">Hiển thị viền</Text>
          <Switch value={showOutline} onValueChange={setShowOutline} disabled={isQuizMode} />
        </View>
      </View>

      <TouchableOpacity 
        onPress={handleNext}
        className="bg-purple-500 w-full py-4 rounded-2xl flex-row justify-center items-center shadow-lg active:bg-purple-600"
      >
        <Text className="text-white font-bold text-lg mr-2">Ký tự tiếp theo</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}
