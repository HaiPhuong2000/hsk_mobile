import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { WordDetail } from '../../../src/components/WordDetail';
import { allVocab } from '../../../src/data';
import { VocabWord } from '../../../src/types';

export default function WordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const word = allVocab.find((w) => w.id === id) as VocabWord;

  if (!word) {
    return (
      <View className="flex-1 bg-dark-900 items-center justify-center">
        <Text className="text-white text-lg">Không tìm thấy từ</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: word.hanzi,
          headerStyle: {
            backgroundColor: '#0f172a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              className="ml-2"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex-1 bg-dark-900">
        <WordDetail word={word} />
      </View>
    </>
  );
}
