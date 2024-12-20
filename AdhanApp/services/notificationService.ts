import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Prayer } from '../hooks/usePrayerTimes';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('prayer-times', {
      name: 'Prayer Times',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  return token;
}

export async function schedulePrayerNotifications(prayers: Prayer[]) {
  // Cancel all existing notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule new notifications for each prayer time
  for (const prayer of prayers) {
    const prayerTime = new Date(prayer.time);
    const now = new Date();

    // Only schedule if the prayer time hasn't passed today
    if (prayerTime > now) {
      const trigger = prayerTime;
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Prayer Time",
          body: `It's time for ${prayer.name} prayer`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger,
      });
    }
  }
}

export async function checkNotificationPermissions() {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;

  const permissionResponse = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowDisplayInCarPlay: true,
      allowCriticalAlerts: true,
      provideAppNotificationSettings: true,
    },
  });

  return permissionResponse.granted;
} 