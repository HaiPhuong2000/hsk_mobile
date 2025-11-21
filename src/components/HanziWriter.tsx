import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

interface HanziWriterProps {
  character: string;
  showOutline?: boolean;
  onCorrect?: () => void;
  onMistake?: () => void;
  mode?: 'animate' | 'quiz' | 'practice';
}

export const HanziWriter: React.FC<HanziWriterProps> = ({ 
  character, 
  showOutline = true,
  onCorrect,
  onMistake,
  mode = 'animate'
}) => {
  const webViewRef = useRef<WebView>(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <script src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js"></script>
      <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: transparent; }
        #character-target-div { width: 300px; height: 300px; }
      </style>
    </head>
    <body>
      <div id="character-target-div"></div>
      <script>
        let writer;
        
        function initWriter(char) {
          document.getElementById('character-target-div').innerHTML = '';
          writer = HanziWriter.create('character-target-div', char, {
            width: 300,
            height: 300,
            padding: 5,
            showOutline: ${showOutline},
            strokeAnimationSpeed: 1,
            delayBetweenStrokes: 1000,
            radicalColor: '#168F16',
          });
          
          if ('${mode}' === 'animate') {
            writer.animateCharacter();
          } else if ('${mode}' === 'quiz') {
            writer.quiz({
              onMistake: function(strokeData) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MISTAKE' }));
              },
              onCorrectStroke: function(strokeData) {
                // Optional: feedback per stroke
              },
              onComplete: function(summaryData) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'COMPLETE' }));
              }
            });
          }
        }

        // Initialize with prop character
        initWriter('${character}');

        // Listen for updates
        document.addEventListener('message', function(event) {
          const data = JSON.parse(event.data);
          if (data.type === 'UPDATE_CHAR') {
            initWriter(data.character);
          } else if (data.type === 'ANIMATE') {
            writer.animateCharacter();
          } else if (data.type === 'QUIZ') {
            writer.quiz();
          }
        });
      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    if (webViewRef.current) {
      // Reload or inject JS if character changes, but full reload is safer for HanziWriter init
      // Actually, injecting JS to call initWriter is better than full reload
      // But for simplicity in this MVP, the key prop on WebView or just re-rendering might be enough.
      // Let's try injecting JS.
      const script = `initWriter('${character}');`;
      webViewRef.current.injectJavaScript(script);
    }
  }, [character, mode, showOutline]);

  const handleMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'COMPLETE' && onCorrect) {
      onCorrect();
    } else if (data.type === 'MISTAKE' && onMistake) {
      onMistake();
    }
  };

  return (
    <View className="flex-1 w-full h-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden">
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        style={{ backgroundColor: 'transparent' }}
        scrollEnabled={false}
      />
    </View>
  );
};
