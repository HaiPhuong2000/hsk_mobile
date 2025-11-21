import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function PracticeScreen() {
  const router = useRouter();

  const practiceOptions = [
    {
      title: 'Thẻ ghi nhớ',
      description: 'Học từ vựng với thẻ ghi nhớ',
      icon: 'albums' as const,
      route: '/(tabs)/practice/flashcards',
      color: 'bg-primary-500',
    },
    {
      title: 'Trắc nghiệm',
      description: 'Luyện tập với câu hỏi trắc nghiệm',
      icon: 'help-circle' as const,
      route: '/(tabs)/practice/quiz',
      color: 'bg-indigo-500',
    },
    {
      title: 'Luyện viết',
      description: 'Luyện viết chữ Hán',
      icon: 'create' as const,
      route: '/(tabs)/practice/writing',
      color: 'bg-purple-500',
    },
    {
      title: 'Ghép từ',
      description: 'Ghép từ với nghĩa của nó',
      icon: 'grid' as const,
      route: '/(tabs)/practice/matching',
      color: 'bg-green-500',
    },
  ];

  return (
    <View className="flex-1 bg-dark-900 p-4">
      <Text className="text-3xl font-bold text-white mb-2 mt-4">
        Chế độ luyện tập
      </Text>
      <Text className="text-dark-300 mb-8">
        Chọn chế độ luyện tập để cải thiện kỹ năng HSK
      </Text>

      {practiceOptions.map((option) => (
        <TouchableOpacity
          key={option.route}
          onPress={() => router.push(option.route as any)}
          className="bg-dark-800/80 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-4 flex-row items-center shadow-lg active:bg-dark-800"
        >
          <View className={`${option.color} p-4 rounded-2xl mr-4 shadow-lg`}>
            <Ionicons name={option.icon} size={32} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-white mb-1">{option.title}</Text>
            <Text className="text-dark-300">{option.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={28} color="#64748b" />
        </TouchableOpacity>
      ))}
    </View>
  );
}
