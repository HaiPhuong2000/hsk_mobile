import { getVocabByLevel } from '@/src/data';
import { getLevelStats } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
  const router = useRouter();
  const [totalStats, setTotalStats] = useState({
    total: 0,
    new: 0,
    familiar: 0,
    known: 0,
    mastered: 0,
  });
  const [levelStats, setLevelStats] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    let total = 0;
    let newCount = 0;
    let familiarCount = 0;
    let knownCount = 0;
    let masteredCount = 0;

    const stats = [];

    for (let level = 1; level <= 6; level++) {
      const vocabData = getVocabByLevel(level);
      const levelStat = await getLevelStats(level, vocabData.length);
      
      total += vocabData.length;
      newCount += levelStat.new;
      familiarCount += levelStat.familiar;
      knownCount += levelStat.known;
      masteredCount += levelStat.mastered;

      stats.push({
        level,
        total: vocabData.length,
        ...levelStat,
      });
    }

    setTotalStats({
      total,
      new: newCount,
      familiar: familiarCount,
      known: knownCount,
      mastered: masteredCount,
    });
    setLevelStats(stats);
  };

  const getProgressPercentage = (stats: any) => {
    if (stats.total === 0) return 0;
    const learned = stats.familiar + stats.known + stats.mastered;
    return Math.round((learned / stats.total) * 100);
  };

  return (
    <ScrollView className="flex-1 bg-dark-900">
      {/* Header */}
      <View className="p-6 pt-12">
        <Text className="text-4xl font-bold text-white mb-2">
          Xin chào! 👋
        </Text>
        <Text className="text-dark-300 text-lg">
          Tiếp tục hành trình học HSK của bạn
        </Text>
      </View>

      {/* Overall Progress */}
      <View className="px-6 mb-6">
        <View className="bg-dark-800/80 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-lg">
          <Text className="text-white text-xl font-bold mb-4">Tổng quan</Text>
          
          <View className="flex-row justify-between mb-4">
            <View className="items-center flex-1">
              <Text className="text-4xl font-bold text-white mb-1">{totalStats.total}</Text>
              <Text className="text-dark-400 text-xs">Tổng từ</Text>
            </View>
            <View className="items-center flex-1 border-l border-white/10">
              <Text className="text-4xl font-bold text-primary-400 mb-1">
                {getProgressPercentage(totalStats)}%
              </Text>
              <Text className="text-dark-400 text-xs">Đã học</Text>
            </View>
          </View>

          <View className="flex-row justify-between pt-4 border-t border-white/10">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-dark-400">{totalStats.new}</Text>
              <Text className="text-dark-500 text-xs">Mới</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-blue-400">{totalStats.familiar}</Text>
              <Text className="text-blue-500 text-xs">Hơi nhớ</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-green-400">{totalStats.known}</Text>
              <Text className="text-green-500 text-xs">Quen thuộc</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-yellow-400">{totalStats.mastered}</Text>
              <Text className="text-yellow-500 text-xs">Nhớ sâu</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-6 mb-6">
        <Text className="text-white text-xl font-bold mb-4">Bắt đầu học</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/practice/quiz')}
            className="flex-1 bg-gradient-to-br from-primary-500 to-indigo-600 p-5 rounded-2xl shadow-lg active:opacity-80"
          >
            <Ionicons name="help-circle" size={32} color="white" />
            <Text className="text-white font-bold text-lg mt-2">Trắc nghiệm</Text>
            <Text className="text-white/80 text-sm">Học từ mới</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/practice/flashcards')}
            className="flex-1 bg-gradient-to-br from-purple-500 to-pink-600 p-5 rounded-2xl shadow-lg active:opacity-80"
          >
            <Ionicons name="albums" size={32} color="white" />
            <Text className="text-white font-bold text-lg mt-2">Thẻ ghi nhớ</Text>
            <Text className="text-white/80 text-sm">Ôn tập</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Level Progress */}
      <View className="px-6 pb-24">
        <Text className="text-white text-xl font-bold mb-4">Tiến độ theo cấp độ</Text>
        {levelStats.map((stat) => (
          <TouchableOpacity
            key={stat.level}
            onPress={() => router.push('/(tabs)/practice/quiz')}
            className="bg-dark-800/80 backdrop-blur-lg border border-white/10 rounded-2xl p-5 mb-3 shadow-lg active:bg-dark-800"
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white text-lg font-bold">HSK {stat.level}</Text>
              <Text className="text-primary-400 font-bold">
                {getProgressPercentage(stat)}%
              </Text>
            </View>
            
            {/* Progress Bar */}
            <View className="h-2 bg-dark-700 rounded-full overflow-hidden mb-3">
              <View
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${getProgressPercentage(stat)}%` }}
              />
            </View>

            <View className="flex-row justify-between">
              <Text className="text-dark-400 text-xs">
                {stat.familiar + stat.known + stat.mastered}/{stat.total} từ
              </Text>
              <View className="flex-row gap-3">
                <Text className="text-blue-400 text-xs">💙 {stat.familiar}</Text>
                <Text className="text-green-400 text-xs">💚 {stat.known}</Text>
                <Text className="text-yellow-400 text-xs">⭐ {stat.mastered}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
