import { StyleSheet, Dimensions, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface PrayerTimeCardProps {
  name: string;
  time: string;
  isNext: boolean;
}

export function PrayerTimeCard({ name, time, isNext }: PrayerTimeCardProps) {
  return (
    <ThemedView style={[styles.container, isNext && styles.nextPrayer]}>
      <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
        <ThemedText style={styles.prayerName}>{name}</ThemedText>
        <View style={styles.timeContainer}>
          {isNext && (
            <View style={styles.nextIndicator}>
              <ThemedText style={styles.nextText}>NEXT</ThemedText>
            </View>
          )}
          <ThemedText style={[styles.prayerTime, isNext && styles.nextPrayerTime]}>
            {time}
          </ThemedText>
        </View>
      </BlurView>
    </ThemedView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  blurContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextPrayer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  prayerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prayerTime: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  nextPrayerTime: {
    color: '#ffffff',
  },
  nextIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nextText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
}); 