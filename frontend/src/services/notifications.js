import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async () => {
  if (!Device.isDevice) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const scheduleDailyStreakReminder = async (hour = 19, minute = 0) => {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  // Cancel any existing streak reminders
  await cancelStreakReminders();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔥 Ne brise pas ta série !',
      body: 'Tu n\'as pas encore pratiqué aujourd\'hui. Fais une leçon pour maintenir ta série !',
      data: { type: 'streak_reminder' },
      sound: true,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
    identifier: 'streak_daily',
  });
};

export const cancelStreakReminders = async () => {
  await Notifications.cancelScheduledNotificationAsync('streak_daily').catch(() => {});
};

export const sendImmediateNotification = async (title, body) => {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: null,
  });
};
