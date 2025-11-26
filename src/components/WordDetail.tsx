import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { VocabWord } from '../types';
import { HanziWriterNative } from './HanziWriterNative';


interface WordDetailProps {
  word: VocabWord;
  onClose?: () => void;
}

export const WordDetail: React.FC<WordDetailProps> = ({ word, onClose }) => {
  const handleSpeak = () => {
    Speech.speak(word.hanzi, {
      language: 'zh-CN',
      pitch: 1.0,
      rate: 0.75,
    });
  };

  const handleSpeakExample = (text: string) => {
    Speech.speak(text, {
      language: 'zh-CN',
      pitch: 1.0,
      rate: 0.75,
    });
  };

  return (
    <ScrollView className="flex-1 bg-dark-900">
      {/* Header */}
      <View className="bg-dark-800/90 backdrop-blur-lg border-b border-white/10 px-6 pt-8 pb-8">
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-1 mr-4">
            <Text className="text-4xl text-primary-300 font-bold mb-2">{word.pinyin}</Text>
          </View>
          <View className="flex-row gap-3 items-center">
            {word.level && (
              <View className="bg-primary-500/20 px-4 py-2 rounded-full border border-primary-500/30">
                <Text className="text-primary-300 text-base font-bold">HSK {word.level}</Text>
              </View>
            )}
            <TouchableOpacity 
              onPress={handleSpeak}
              className="bg-primary-500/20 p-2 rounded-full border border-primary-500/30 active:bg-primary-500/30"
            >
              <Ionicons name="volume-high" size={20} color="#a5b4fc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Translations */}
        <View className="border-t border-white/10 pt-4">
          <Text className="text-dark-400 text-xs uppercase font-semibold mb-2">Nghĩa</Text>
          {word.translations.map((translation, index) => (
            <Text key={index} className="text-white text-lg leading-7 mb-1">
              • {translation}
            </Text>
          ))}
        </View>
      </View>

      {/* Examples Section */}
      <View className="px-4 py-6">
        <Text className="text-white text-xl font-bold mb-4">Ví dụ</Text>
        {word.examples && word.examples.length > 0 ? (
          word.examples.map((example, index) => (
            <View 
              key={index}
              className="bg-dark-800/60 backdrop-blur-lg border border-white/10 rounded-2xl p-5 mb-4"
            >
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-primary-400 text-xs font-bold tracking-wider uppercase">Ví dụ {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => handleSpeakExample(example.chinese)}
                  className="bg-primary-500/20 p-2.5 rounded-full active:bg-primary-500/30"
                >
                  <Ionicons name="volume-high" size={18} color="#a5b4fc" />
                </TouchableOpacity>
              </View>
              <Text className="text-white text-xl font-medium mb-2 leading-8">{example.chinese}</Text>
              <Text className="text-primary-300 text-lg mb-2">{example.pinyin}</Text>
              <Text className="text-dark-300 text-base italic">{example.vietnamese}</Text>
            </View>
          ))
        ) : (
          <View className="bg-dark-800/40 rounded-2xl p-6 items-center border border-white/5">
            <Text className="text-dark-400 italic">Chưa có ví dụ cho từ này</Text>
          </View>
        )}
      </View>

      {/* Character Writing Guide */}
      <View className="px-4 pb-8">
        <Text className="text-white text-xl font-bold mb-4">Hướng dẫn viết chữ</Text>
        <View className="bg-dark-800/60 backdrop-blur-lg border border-white/10 rounded-2xl p-4">
          <HanziWriterNative character={word.hanzi} mode="animate" />
        </View>
      </View>
    </ScrollView>
  );
};
