import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { CalculationMethod } from 'adhan';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const CALCULATION_METHODS = [
  { label: 'Muslim World League', value: 'MuslimWorldLeague', description: 'Standard method used by the Muslim World League' },
  { label: 'Islamic Society of North America', value: 'NorthAmerica', description: 'Used by ISNA, based on Fajr at 15° and Isha at 15°' },
  { label: 'Egyptian General Authority', value: 'Egyptian', description: 'Egyptian General Authority of Survey, Fajr at 19.5° and Isha at 17.5°' },
  { label: 'Umm Al-Qura University', value: 'UmmAlQura', description: 'Used in Saudi Arabia, Fajr at 18.5° and Isha 90min after Maghrib' },
  { label: 'Moonsighting Committee', value: 'MoonsightingCommittee', description: 'Developed by Moonsighting Committee Worldwide' }
] as const;

interface LocationInfo {
  city: string;
  address: string;
  coords: {
    latitude: number;
    longitude: number;
  };
}

export default function SettingsScreen() {
  const { method, setMethod } = usePrayerTimes();
  const [selectedMethod, setSelectedMethod] = useState<keyof typeof CalculationMethod>(method);
  const [useLocation, setUseLocation] = useState('auto');
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const updateLocationInfo = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for accurate prayer times.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        setLocationInfo({
          city: address.city || 'Unknown City',
          address: address.street ? `${address.street}` : 'Unknown Address',
          coords: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get location information');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    updateLocationInfo();
  }, []);

  const handleApplyChanges = async () => {
    try {
      await setMethod(selectedMethod);
      Alert.alert(
        'Settings Updated',
        'Prayer times have been recalculated with the new method.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to update settings. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>Settings</ThemedText>
        </View>
        
        <View style={styles.card}>
          <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
            <ThemedText style={styles.label}>Current Location</ThemedText>
            <View style={styles.locationCard}>
              {isLoadingLocation ? (
                <ThemedText>Loading location...</ThemedText>
              ) : locationInfo ? (
                <>
                  <ThemedText style={styles.cityText}>{locationInfo.city}</ThemedText>
                  <ThemedText style={styles.addressText}>{locationInfo.address}</ThemedText>
                  <ThemedText style={styles.coordsText}>
                    Longitude: {locationInfo.coords.longitude.toFixed(4)} {'\n'}
                    Latitude: {locationInfo.coords.latitude.toFixed(4)}
                  </ThemedText>
                </>
              ) : (
                <ThemedText>Location unavailable</ThemedText>
              )}
            </View>

            <TouchableOpacity 
              style={styles.updateLocationButton} 
              onPress={updateLocationInfo}>
              <View style={styles.updateLocationContent}>
                <ThemedText style={styles.updateLocationText}>Update Location</ThemedText>
                <ThemedText style={styles.autoText}>Auto</ThemedText>
                <Ionicons name="navigate" size={20} color="#ff3b00" />
              </View>
            </TouchableOpacity>

            <ThemedText style={[styles.label, styles.secondLabel]}>Calculation Method</ThemedText>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedMethod}
                onValueChange={setSelectedMethod}
                style={styles.picker}
                dropdownIconColor="#ff3b00"
                itemStyle={styles.pickerItem}>
                {CALCULATION_METHODS.map((method) => (
                  <Picker.Item 
                    key={method.value}
                    label={method.label} 
                    value={method.value} 
                  />
                ))}
              </Picker>
            </View>
            
            <ThemedText style={styles.methodDescription}>
              {CALCULATION_METHODS.find(m => m.value === selectedMethod)?.description}
            </ThemedText>

            <TouchableOpacity 
              style={styles.applyButton} 
              onPress={handleApplyChanges}
              activeOpacity={0.7}>
              <BlurView intensity={80} tint="dark" style={styles.applyButtonContent}>
                <ThemedText style={styles.applyButtonText}>Apply Changes</ThemedText>
              </BlurView>
            </TouchableOpacity>
          </BlurView>
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
    paddingHorizontal: 16,
  },
  titleContainer: {
    paddingVertical: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    includeFontPadding: false,
    lineHeight: 44,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  blurContainer: {
    padding: 24,
    paddingTop: 28,
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    includeFontPadding: false,
  },
  locationCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cityText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
  coordsText: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 20,
  },
  updateLocationButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  updateLocationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  updateLocationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  autoText: {
    fontSize: 16,
    color: '#999999',
    marginRight: 8,
  },
  secondLabel: {
    marginTop: 8,
  },
  pickerContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  picker: {
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  pickerItem: {
    color: '#ffffff',
    backgroundColor: '#1a1a1a',
    fontSize: 16,
    height: 120,
  },
  methodDescription: {
    fontSize: 14,
    color: '#999999',
    marginTop: 12,
    lineHeight: 20,
  },
  applyButton: {
    marginTop: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ff3b00',
  },
  applyButtonContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 0, 0.1)',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff3b00',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
}); 