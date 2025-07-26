import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
export const getFCMToken = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const fcmToken = await messaging().getToken();
    console.log('🔥 Device FCM Token:', fcmToken);
    return fcmToken;
  } else {
    console.log('❌ Notification permission not granted');
    Alert.alert(
      '❌ Notification Permission',
      'Please enable notifications in your device settings to receive updates.'
    );
    return null;
  }
};
