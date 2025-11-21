import { getVocabByLevel } from '@/src/data';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function MatchingScreen() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  useEffect(() => {
    if (selectedLevel) {
      startNewGame(selectedLevel);
    }
  }, [selectedLevel]);

  const startNewGame = (level: number) => {
    const data = getVocabByLevel(level);
    if (data.length < 4) {
      Alert.alert("Lỗi", "Không đủ từ cho cấp độ này");
      return;
    }

    // Pick 4 random words
    const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 4);
    
    // Create pairs (Hanzi and Meaning) - lưu cả hanzi để phát âm
    const pairs: { id: string, text: string, type: 'hanzi' | 'meaning', hanzi?: string }[] = [];
    shuffled.forEach(word => {
      pairs.push({ id: word.id, text: word.hanzi, type: 'hanzi', hanzi: word.hanzi });
      pairs.push({ id: word.id, text: word.translations[0], type: 'meaning', hanzi: word.hanzi });
    });

    // Shuffle pairs
    setItems(pairs.sort(() => Math.random() - 0.5));
    setMatchedIds([]);
    setSelectedId(null);
  };

  const handlePress = (item: any, index: number) => {
    if (matchedIds.includes(item.id)) return;

    // Phát âm khi chọn từ
    if (item.hanzi) {
      Speech.speak(item.hanzi, {
        language: 'zh-CN',
        pitch: 1.0,
        rate: 0.75,
      });
    }

    if (selectedId === null) {
      setSelectedId(index.toString());
    } else {
      const firstIndex = parseInt(selectedId);
      const firstItem = items[firstIndex];

      if (firstIndex === index) {
        setSelectedId(null);
      } else if (firstItem.id === item.id && firstItem.type !== item.type) {
        setMatchedIds([...matchedIds, item.id]);
        setSelectedId(null);
        
        if (matchedIds.length + 1 === items.length / 2) {
          setTimeout(() => {
            Alert.alert("Thành công!", "Bạn đã ghép đúng tất cả!", [
              { text: "Chơi lại", onPress: () => startNewGame(selectedLevel!) }
            ]);
          }, 500);
        }
      } else {
        Alert.alert("Sai rồi", "Thử lại nhé!");
        setSelectedId(null);
      }
    }
  };

  if (!selectedLevel) {
    return (
      <View className="flex-1 bg-dark-900 p-4">
        <Text className="text-3xl font-bold text-white mb-3 text-center mt-10">
          Chọn cấp độ chơi
        </Text>
        <Text className="text-dark-300 text-center mb-8">
          Chọn cấp độ để chơi trò ghép từ
        </Text>
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          numColumns={2}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedLevel(item)}
              className="flex-1 m-2 bg-dark-800/80 backdrop-blur-lg border border-green-500/30 p-8 rounded-2xl shadow-lg items-center active:bg-dark-800"
            >
              <Text className="text-3xl font-bold text-green-400 mb-2">HSK {item}</Text>
              <Text className="text-dark-300 text-sm">
                {getVocabByLevel(item).length} từ
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-900 p-4">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => setSelectedLevel(null)} className="mr-4 bg-dark-800/80 p-3 rounded-full border border-white/10">
          <Ionicons name="arrow-back" size={24} color="#a5b4fc" />
        </TouchableOpacity>
        <Text className="text-center text-dark-200 text-lg flex-1 mr-12">Ghép Hán tự với nghĩa của nó</Text>
      </View>
      
      <View className="flex-row flex-wrap justify-between">
        {items.map((item, index) => {
          const isSelected = selectedId === index.toString();
          const isMatched = matchedIds.includes(item.id);
          
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(item, index)}
              disabled={isMatched}
              className={`w-[48%] h-24 mb-4 rounded-2xl items-center justify-center p-3 border-2 shadow-lg ${
                isMatched 
                  ? 'bg-green-500/20 border-green-500 backdrop-blur-lg' 
                  : isSelected 
                    ? 'bg-primary-500/30 border-primary-500 backdrop-blur-lg' 
                    : 'bg-dark-800/80 border-white/10 backdrop-blur-lg'
              }`}
            >
              <Text className={`text-center font-bold ${
                item.type === 'hanzi' ? 'text-3xl' : 'text-base'
              } ${
                isMatched ? 'text-green-300' : isSelected ? 'text-primary-300' : 'text-white'
              }`}>
                {item.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity 
        onPress={() => startNewGame(selectedLevel)}
        className="mt-8 bg-dark-800/80 backdrop-blur-lg border border-white/10 p-4 rounded-2xl items-center shadow-lg active:bg-dark-800"
      >
        <Text className="font-bold text-white text-lg">Chơi lại</Text>
      </TouchableOpacity>
    </View>
  );
}
