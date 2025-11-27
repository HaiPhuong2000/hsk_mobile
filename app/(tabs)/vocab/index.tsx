import { WordCard } from '@/src/components/WordCard';
import { allVocab } from '@/src/data';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function VocabScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number>(1); // Mặc định HSK 1

  const filteredData = useMemo(() => {
    let data = allVocab.filter(word => word.level === selectedLevel);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(word => 
        word.hanzi.includes(query) ||
        word.pinyin.toLowerCase().includes(query) ||
        word.translations.some(t => t.toLowerCase().includes(query))
      );
    }
    
    return data;
  }, [searchQuery, selectedLevel]);

  const levels = [1, 2, 3, 4, 5, 6];

  return (
    <View className="flex-1 bg-dark-900">
      {/* Search Bar */}
      <View className="px-4 pt-4 pb-3">
        <View className="bg-dark-800/80 backdrop-blur-lg border border-white/10 rounded-2xl px-4 py-3 flex-row items-center">
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-3 text-white text-base"
            placeholder="Tìm kiếm theo Hán tự, Pinyin hoặc nghĩa..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Level Filter */}
      <View className="px-4 pb-3">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={levels}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedLevel(item)}
              className={`mr-2 px-4 py-2 rounded-full border ${
                selectedLevel === item
                  ? 'bg-primary-500 border-primary-500'
                  : 'bg-dark-800/60 border-white/10'
              }`}
            >
              <Text className={`font-semibold ${
                selectedLevel === item ? 'text-white' : 'text-dark-300'
              }`}>
                {`HSK ${item}`}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Results Count */}
      <View className="px-4 pb-2">
        <Text className="text-dark-400 text-sm">
          {filteredData.length} từ
        </Text>
      </View>

      {/* Vocabulary List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="px-4">
            <WordCard
              hanzi={item.hanzi}
              pinyin={item.pinyin}
              translations={item.translations}
              level={item.level}
              onPress={() => router.push(`/vocab/${item.id}`)}
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

