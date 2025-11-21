import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FlashcardProps {
  hanzi: string;
  pinyin: string;
  translations: string[];
  onNext: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ hanzi, pinyin, translations, onNext }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnim] = useState(new Animated.Value(0));

  const handleFlip = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = () => {
    Speech.speak(hanzi, {
      language: 'zh-CN',
      pitch: 1.0,
      rate: 0.75,
    });
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 90, 180],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 90, 180],
    outputRange: [0, 0, 1],
  });

  return (
    <View className="w-full items-center">
      <TouchableOpacity 
        onPress={handleFlip}
        activeOpacity={0.9}
        className="w-full max-w-md"
      >
        <View className="h-96 relative">
          {/* Front of card */}
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ rotateY: frontInterpolate }],
                opacity: frontOpacity,
              }
            ]}
            className="absolute w-full h-full bg-dark-800/90 backdrop-blur-lg border-2 border-primary-500/30 rounded-3xl p-8 items-center justify-center shadow-2xl"
          >
            <View className="items-center">
              <Text className="text-7xl font-bold text-white mb-4">{hanzi}</Text>
              <Text className="text-2xl text-primary-300 mb-6">{pinyin}</Text>
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  handleSpeak();
                }}
                className="bg-primary-500/20 p-4 rounded-full border border-primary-500/30 active:bg-primary-500/30"
              >
                <Ionicons name="volume-high" size={28} color="#a5b4fc" />
              </TouchableOpacity>
            </View>
            <View className="absolute bottom-6">
              <Text className="text-dark-400 text-sm">Nhấn để xem nghĩa</Text>
            </View>
          </Animated.View>

          {/* Back of card */}
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ rotateY: backInterpolate }],
                opacity: backOpacity,
              }
            ]}
            className="absolute w-full h-full bg-dark-800/90 backdrop-blur-lg border-2 border-primary-500/30 rounded-3xl p-8 items-center justify-center shadow-2xl"
          >
            <View className="items-center flex-1 justify-center">
              <Text className="text-4xl font-bold text-white mb-3">{hanzi}</Text>
              <Text className="text-xl text-primary-300 mb-8">{pinyin}</Text>
              <View className="w-full px-4">
                {translations.map((translation, index) => (
                  <Text key={index} className="text-dark-200 text-lg text-center leading-7 mb-2">
                    {translation}
                  </Text>
                ))}
              </View>
            </View>
            <View className="absolute bottom-6">
              <Text className="text-dark-400 text-sm">Nhấn để lật lại</Text>
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={onNext}
        className="mt-8 bg-primary-500 px-8 py-4 rounded-2xl flex-row items-center gap-2 shadow-lg active:bg-primary-600"
      >
        <Text className="text-white font-bold text-lg">Thẻ tiếp theo</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backfaceVisibility: 'hidden',
  },
});
