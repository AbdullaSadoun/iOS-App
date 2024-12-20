import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, View } from 'react-native';
import { Platform } from 'react-native';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={100}
        style={StyleSheet.absoluteFill}
        tint="dark"
      />
    );
  }

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: '#000000cc',
        },
      ]}
    />
  );
}

export function useBottomTabOverflow() {
  return 0;
}
