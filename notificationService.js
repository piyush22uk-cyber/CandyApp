
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './services/api';
// import api from './api';

// STEP 1: App open hone par notification kaise dikhani hai
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// STEP 2: Mobile ka Expo Push Token generate karna
export async function registerForPushNotificationsAsync() {
  try {
    // Push notifications ke liye physical mobile chahiye
    if (!Device.isDevice) {
      console.log('ERROR: Physical mobile required');
      return null;
    }

    // Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'CandyApp Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    // Permission check karna
    const permission = await Notifications.getPermissionsAsync();

    let status = permission.status;

    // Permission nahi mili to request karna
    if (status !== 'granted') {
      const result = await Notifications.requestPermissionsAsync();
      status = result.status;
    }

    if (status !== 'granted') {
      console.log('ERROR: Notification permission denied');
      return null;
    }

    // Expo project ID lena
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.log('ERROR: EAS project ID missing');
      return null;
    }

    // Push token generate karna
    const response = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    const expoPushToken = response.data;

    console.log('Expo Push Token generated successfully');

    return expoPushToken;
  } catch (error) {
    console.log('TOKEN GENERATION ERROR:', error.message);
    return null;
  }
}

// STEP 3: Expo Push Token backend par save karna
export async function savePushTokenToBackend() {
  try {
    // Login token lena
    const loginToken = await AsyncStorage.getItem('token');

    if (!loginToken) {
      console.log('ERROR: Login token not found. Please login again.');
      return false;
    }

    // Expo Push Token generate karna
    const expoPushToken = await registerForPushNotificationsAsync();

    if (!expoPushToken) {
      console.log('ERROR: Expo Push Token not generated');
      return false;
    }

    // Backend ko request bhejna
    const response = await api.post(
      '/auth/notifications/token',
      { expoPushToken },
      {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      }
    );

    console.log('SUCCESS:', response.data.message);

    return true;
  } catch (error) {
    if (error.response) {
      // Backend ne error response diya
      console.log('BACKEND STATUS:', error.response.status);
      console.log('BACKEND ERROR:', error.response.data);
    } else if (error.request) {
      // Request ka response nahi mila
      console.log('NETWORK ERROR: Backend se response nahi mila.');
      console.log('Check API IP, Wi-Fi and backend server.');
    } else {
      console.log('REQUEST ERROR:', error.message);
    }

    return false;
  }
}
