import { Ionicons } from '@expo/vector-icons';
import { HanziWriter, useHanziWriter } from '@jamsch/react-native-hanzi-writer';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface HanziWriterNativeProps {
  character: string;
  mode?: 'animate' | 'quiz';
  onComplete?: () => void;
  onCorrectStroke?: () => void;
  onMistake?: () => void;
}

export const HanziWriterNative: React.FC<HanziWriterNativeProps> = ({ 
  character, 
  mode = 'animate',
  onComplete,
  onCorrectStroke,
  onMistake
}) => {
  const writer = useHanziWriter({
    character,
    loader(char) {
      return fetch(
        `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`
      ).then((res) => res.json());
    },
  });

  const quizActive = writer.quiz.useStore((s) => s.active);
  const animatorState = writer.animator.useStore((s) => s.state);

  const handleAnimate = () => {
    if (animatorState === 'playing') {
      writer.animator.cancelAnimation();
    } else {
      writer.animator.animateCharacter({
        delayBetweenStrokes: 400,
        strokeDuration: 400,
        onComplete() {
          console.log('Animation complete!');
        },
      });
    }
  };

  const handleQuiz = () => {
    writer.quiz.start({
      leniency: 1,
      showHintAfterMisses: 2,
      onComplete: (data) => {
        onComplete?.();
        console.log('Quiz complete!', data);
      },
      onCorrectStroke: () => {
        onCorrectStroke?.();
      },
      onMistake: (data) => {
        onMistake?.();
      },
    });
  };

  const handleCancelQuiz = () => {
    writer.quiz.stop();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="w-full">
        {/* HanziWriter Canvas */}
        <View className="bg-white rounded-xl overflow-hidden mb-4" style={{ height: 300, alignItems: 'center', justifyContent: 'center' }}>
          <HanziWriter
            writer={writer}
            loading={<Text>Đang tải...</Text>}
            error={
              <View>
                <Text>Lỗi khi tải chữ.</Text>
                <TouchableOpacity onPress={writer.refetch} className="mt-2">
                  <Text className="text-primary-500">Thử lại</Text>
                </TouchableOpacity>
              </View>
            }
            style={{ alignSelf: 'center' }}
          >
            <HanziWriter.GridLines color="#ddd" />
            <HanziWriter.Svg>
              <HanziWriter.Outline color="#ccc" />
              <HanziWriter.Character color="#000" radicalColor="#168F16" />
              <HanziWriter.QuizStrokes />
              <HanziWriter.QuizMistakeHighlighter
                color="#ef4444"
                strokeDuration={400}
              />
            </HanziWriter.Svg>
          </HanziWriter>
        </View>

        {/* Controls */}
        <View className="flex-row justify-center gap-2 flex-wrap">
          {!quizActive && (
            <>
              <TouchableOpacity 
                onPress={handleAnimate}
                className="bg-primary-500 px-4 py-3 rounded-xl flex-row items-center gap-2"
              >
                <Ionicons name={animatorState === 'playing' ? 'stop' : 'play'} size={20} color="white" />
                <Text className="text-white font-semibold">
                  {animatorState === 'playing' ? 'Dừng' : 'Xem nét vẽ'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleQuiz}
                className="bg-green-500 px-4 py-3 rounded-xl flex-row items-center gap-2"
              >
                <Ionicons name="pencil" size={20} color="white" />
                <Text className="text-white font-semibold">Luyện viết</Text>
              </TouchableOpacity>
            </>
          )}

          {quizActive && (
            <TouchableOpacity 
              onPress={handleCancelQuiz}
              className="bg-red-500 px-4 py-3 rounded-xl flex-row items-center gap-2"
            >
              <Ionicons name="close" size={20} color="white" />
              <Text className="text-white font-semibold">Hủy</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
};
