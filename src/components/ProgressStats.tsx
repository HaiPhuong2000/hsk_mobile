import React from 'react';
import { Text, View } from 'react-native';

interface ProgressStatsProps {
  stats: {
    new: number;
    familiar: number;
    known: number;
    mastered: number;
  };
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({ stats }) => {
  return (
    <View className="flex-row justify-between bg-dark-800/80 backdrop-blur-lg border border-white/10 rounded-2xl p-4 mb-6">
      <View className="items-center flex-1">
        <Text className="text-dark-400 text-xs mb-1">Mới</Text>
        <Text className="text-white text-2xl font-bold">{stats.new}</Text>
      </View>
      <View className="items-center flex-1 border-l border-white/10">
        <Text className="text-blue-400 text-xs mb-1">Hơi nhớ</Text>
        <Text className="text-blue-300 text-2xl font-bold">{stats.familiar}</Text>
      </View>
      <View className="items-center flex-1 border-l border-white/10">
        <Text className="text-green-400 text-xs mb-1">Quen thuộc</Text>
        <Text className="text-green-300 text-2xl font-bold">{stats.known}</Text>
      </View>
      <View className="items-center flex-1 border-l border-white/10">
        <Text className="text-yellow-400 text-xs mb-1">Nhớ sâu</Text>
        <Text className="text-yellow-300 text-2xl font-bold">{stats.mastered}</Text>
      </View>
    </View>
  );
};
