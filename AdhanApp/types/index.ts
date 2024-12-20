import { CalculationMethod } from 'adhan';

export interface PrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface UserPreferences {
  calculationMethod: CalculationMethod;
  notificationsEnabled: boolean;
  useAdhanSound: boolean;
  adjustments: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
}

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
} 