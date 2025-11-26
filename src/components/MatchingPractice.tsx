import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { VocabWord } from '../types';

interface MatchingPracticeProps {
  words: VocabWord[];
  onComplete: (results: { wordId: string; correct: boolean }[]) => void;
}

interface Card {
  id: string;
  content: string;
  type: 'hanzi' | 'meaning';
  wordId: string;
  matched: boolean;
}

export const MatchingPractice: React.FC<MatchingPracticeProps> = ({ words, onComplete }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [matches, setMatches] = useState<{ wordId: string; correct: boolean }[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Initialize cards from words
    const hanziCards: Card[] = words.map((word) => ({
      id: `hanzi-${word.id}`,
      content: word.hanzi,
      type: 'hanzi',
      wordId: word.id,
      matched: false,
    }));

    const meaningCards: Card[] = words.map((word) => ({
      id: `meaning-${word.id}`,
      content: word.translations[0],
      type: 'meaning',
      wordId: word.id,
      matched: false,
    }));

    // Shuffle all cards together
    const allCards = [...hanziCards, ...meaningCards].sort(() => Math.random() - 0.5);
    setCards(allCards);
  }, [words]);

  const handleCardPress = (card: Card) => {
    if (card.matched) return;

    if (!selectedCard) {
      // First selection
      setSelectedCard(card);
      Haptics.selectionAsync();
    } else if (selectedCard.id === card.id) {
      // Deselect
      setSelectedCard(null);
    } else {
      // Second selection - check if match
      const isMatch = selectedCard.wordId === card.wordId && selectedCard.type !== card.type;

      if (isMatch) {
        // Correct match
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCards(prevCards =>
          prevCards.map(c =>
            c.id === selectedCard.id || c.id === card.id
              ? { ...c, matched: true }
              : c
          )
        );
        setMatches(prev => [...prev, { wordId: card.wordId, correct: true }]);
        setScore(prev => prev + 1);
        setSelectedCard(null);
      } else {
        // Incorrect match
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setMatches(prev => [...prev, { wordId: card.wordId, correct: false }]);
        setSelectedCard(null);
      }
    }
  };

  const allMatched = cards.every(card => card.matched);

  useEffect(() => {
    if (allMatched && cards.length > 0) {
      onComplete(matches);
    }
  }, [allMatched, cards.length]);

  const renderCard = ({ item }: { item: Card }) => {
    const isSelected = selectedCard?.id === item.id;
    const bgColor = item.matched
      ? 'bg-green-500/20 border-green-500'
      : isSelected
      ? 'bg-primary-500/30 border-primary-500'
      : item.type === 'hanzi'
      ? 'bg-dark-800/80 border-primary-500/30'
      : 'bg-dark-800/80 border-purple-500/30';

    return (
      <TouchableOpacity
        onPress={() => handleCardPress(item)}
        disabled={item.matched}
        className={`m-2 p-6 rounded-2xl border-2 ${bgColor} ${
          item.matched ? 'opacity-50' : ''
        }`}
        style={{ flex: 1, minWidth: 140 }}
      >
        <View className="items-center justify-center">
          {item.matched && (
            <View className="absolute top-0 right-0">
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            </View>
          )}
          <Text
            className={`${
              item.type === 'hanzi' ? 'text-4xl font-bold' : 'text-lg'
            } text-white text-center`}
          >
            {item.content}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (allMatched && cards.length > 0) {
    const accuracy = (score / words.length) * 100;
    return (
      <View className="flex-1 items-center justify-center p-6">
        <View className="bg-dark-800/90 rounded-3xl p-8 items-center border border-primary-500/30">
          <Ionicons name="trophy" size={80} color="#fbbf24" />
          <Text className="text-white text-3xl font-bold mt-4 mb-2">Hoàn thành!</Text>
          <Text className="text-primary-300 text-xl mb-6">
            Điểm số: {score}/{words.length}
          </Text>
          <Text className="text-dark-300 text-lg">
            Độ chính xác: {accuracy.toFixed(0)}%
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-900">
      <View className="px-4 py-4 border-b border-white/10">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-xl font-bold">Ghép đôi từ vựng</Text>
          <View className="bg-primary-500/20 px-4 py-2 rounded-full border border-primary-500/30">
            <Text className="text-primary-300 font-semibold">
              {score}/{words.length}
            </Text>
          </View>
        </View>
        <Text className="text-dark-400 text-sm mt-2">
          Chạm vào chữ Hán và nghĩa tương ứng để ghép đôi
        </Text>
      </View>

      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
      />
    </View>
  );
};
