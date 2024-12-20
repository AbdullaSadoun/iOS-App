import { StyleSheet, ScrollView, ActivityIndicator, View, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { PrayerTimeCard } from '../../components/PrayerTimeCard';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useEffect } from 'react';
import { checkNotificationPermissions, schedulePrayerNotifications } from '../../services/notificationService';

const { width } = Dimensions.get('window');

export default function PrayerTimesScreen() {
  const { prayers, loading, error } = usePrayerTimes();

  useEffect(() => {
    async function setupNotifications() {
      try {
        const hasPermission = await checkNotificationPermissions();
        if (!hasPermission) {
          Alert.alert(
            'Notifications Required',
            'Please enable notifications to receive prayer time reminders.',
            [{ text: 'OK' }]
          );
          return;
        }

        if (prayers.length > 0) {
          await schedulePrayerNotifications(prayers);
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    }

    setupNotifications();
  }, [prayers]);

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a237e', '#4a148c', '#880e4f']}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={[styles.safeArea, styles.centered]}>
          <ActivityIndicator size="large" color="#ffffff" />
        </SafeAreaView>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a237e', '#4a148c', '#880e4f']}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={[styles.safeArea, styles.centered]}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </SafeAreaView>
      </View>
    );
  }

  const getNextPrayer = () => {
    const now = new Date();
    return prayers.findIndex(prayer => prayer.time > now);
  };

  const nextPrayerIndex = getNextPrayer();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#4a148c', '#880e4f']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <ThemedText style={styles.arabicText}>وَإِنَّكَ لَعَلى خُلُقٍ عَظِيمٍ</ThemedText>
            <View style={styles.dateContainer}>
              <ThemedText style={styles.dateText}>
                {new Date().toLocaleDateString('en-US', { 
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </ThemedText>
            </View>
          </View>

          <View style={styles.nextPrayersContainer}>
            <View style={styles.prayerTimeRow}>
              <View style={styles.prayerTimeBlock}>
                <ThemedText style={styles.prayerLabel}>Isha</ThemedText>
                <ThemedText style={styles.prayerTime}>
                  {prayers[5]?.time.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </ThemedText>
              </View>
              <View style={styles.dateBlock}>
                <ThemedText style={styles.hijriDate}>19</ThemedText>
                <ThemedText style={styles.hijriMonth}>جمادى الثاني</ThemedText>
              </View>
              <View style={styles.prayerTimeBlock}>
                <ThemedText style={styles.prayerLabel}>Fajr</ThemedText>
                <ThemedText style={styles.prayerTime}>
                  {prayers[0]?.time.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </ThemedText>
              </View>
            </View>
          </View>

          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {prayers.map((prayer, index) => (
              <PrayerTimeCard
                key={prayer.name}
                name={prayer.name}
                time={prayer.time.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
                isNext={index === nextPrayerIndex}
              />
            ))}
            <View style={styles.bottomPadding} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
    paddingTop: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 5,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  arabicText: {
    fontSize: 32,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 20,
    lineHeight: 48,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  dateContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dateText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  nextPrayersContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  prayerTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
  },
  prayerTimeBlock: {
    alignItems: 'center',
  },
  prayerLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  prayerTime: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  dateBlock: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  hijriDate: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  hijriMonth: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  bottomPadding: {
    height: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#ffffff',
  },
});
