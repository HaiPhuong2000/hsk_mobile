import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface WordCardProps {
  hanzi: string;
  pinyin: string;
  translations: string[];
  level?: number;
}

export const WordCard: React.FC<WordCardProps> = ({ hanzi, pinyin, translations, level }) => {
  const handleSpeak = () => {
    Speech.speak(hanzi, {
      language: 'zh-CN',
      pitch: 1.0,
      rate: 0.75,
    });
  };

  return (
    <View className="bg-dark-800/80 backdrop-blur-lg border border-white/10 rounded-2xl p-5 mb-3 shadow-lg">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-4xl font-bold text-white mb-2">{hanzi}</Text>
          <Text className="text-lg text-primary-400 mb-2">{pinyin}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          {level && (
            <View className="bg-primary-500/20 px-3 py-1 rounded-full border border-primary-500/30">
              <Text className="text-primary-300 text-xs font-semibold">HSK {level}</Text>
            </View>
          )}
          <TouchableOpacity 
            onPress={handleSpeak}
            className="bg-primary-500/20 p-3 rounded-full border border-primary-500/30 active:bg-primary-500/30"
          >
            <Ionicons name="volume-high" size={20} color="#a5b4fc" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View className="border-t border-white/10 pt-3">
        {translations.map((translation, index) => (
          <Text key={index} className="text-dark-300 text-base leading-6 mb-1">
            • {translation}
          </Text>
        ))}
      </View>
    </View>
  );
};
