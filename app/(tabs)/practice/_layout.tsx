import { Stack } from 'expo-router';
import React from 'react';

export default function PracticeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="index" options={{ title: 'Luyện tập' }} />
      <Stack.Screen name="flashcards" options={{ title: 'Thẻ ghi nhớ' }} />
      <Stack.Screen name="quiz" options={{ title: 'Trắc nghiệm' }} />
      <Stack.Screen name="writing" options={{ title: 'Luyện viết' }} />
      <Stack.Screen name="matching" options={{ title: 'Ghép từ' }} />
    </Stack>
  );
}
