import { useState, useEffect, useCallback } from 'react';
import { PrayerTimes, Coordinates, CalculationMethod } from 'adhan';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Prayer {
  name: string;
  time: Date;
}

export function usePrayerTimes() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<keyof typeof CalculationMethod>('MuslimWorldLeague');

  const getPrayerTimes = useCallback(async () => {
    try {
      setLoading(true);
      // Get location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission is required');
        setLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const coordinates = new Coordinates(
        location.coords.latitude,
        location.coords.longitude
      );

      // Get saved calculation method
      const savedMethod = await AsyncStorage.getItem('calculationMethod');
      const currentMethod = savedMethod as keyof typeof CalculationMethod || method;

      // Calculate prayer times
      const date = new Date();
      const params = CalculationMethod[currentMethod]();
      const prayerTimes = new PrayerTimes(coordinates, date, params);

      const prayerList: Prayer[] = [
        { name: 'Fajr', time: prayerTimes.fajr },
        { name: 'Sunrise', time: prayerTimes.sunrise },
        { name: 'Dhuhr', time: prayerTimes.dhuhr },
        { name: 'Asr', time: prayerTimes.asr },
        { name: 'Maghrib', time: prayerTimes.maghrib },
        { name: 'Isha', time: prayerTimes.isha },
      ];

      setPrayers(prayerList);
      if (savedMethod) {
        setMethod(savedMethod as keyof typeof CalculationMethod);
      }
    } catch (err) {
      setError('Failed to get prayer times');
      console.error('Prayer times error:', err);
    } finally {
      setLoading(false);
    }
  }, [method]);

  // Initial load
  useEffect(() => {
    getPrayerTimes();
  }, []);

  // Handle method changes
  useEffect(() => {
    getPrayerTimes();
  }, [method]);

  const updateMethod = async (newMethod: keyof typeof CalculationMethod) => {
    setMethod(newMethod);
    await AsyncStorage.setItem('calculationMethod', newMethod);
    await getPrayerTimes();
  };

  return { 
    prayers, 
    loading, 
    error, 
    method, 
    setMethod: updateMethod,
    refreshPrayerTimes: getPrayerTimes 
  };
} 