import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeModules, Alert, Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging'; // Import Firebase Messaging
import AppNavigator from './src/AppNavigator';
import { firebase } from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification'; // ✅ Push notification lib
import Sound from 'react-native-sound'; // ✅ For playing sound
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';

const App = () => {
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      const sdkInt = Platform.Version;

      if (sdkInt >= 33) {
        // Android 13+ (API 33+) requires explicit notification permission
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('✅ Notification Permission Granted');
          } else {
            Alert.alert('❌ Notification Permission Denied');
          }
        } catch (err) {
          console.warn('Permission error:', err);
        }
      } else {
        // Android 12 or below — permission not needed
        console.log('Notification permission not required on this Android version.');
      }
    }
  };

  // const { DeveloperOptions } = NativeModules;

  // useEffect(() => {
  //   if (DeveloperOptions?.isDeveloperOptionsEnabled) {
  //     DeveloperOptions.isDeveloperOptionsEnabled()
  //       .then((enabled) => {
  //         console.log('Developer Options are', enabled ? 'ON' : 'OFF');
  //         // Optional: show alert
  //         // Alert.alert('Developer Options', enabled ? 'Enabled' : 'Disabled');
  //       })
  //       .catch((error) => {
  //         console.error('Error checking Developer Options:', error);
  //       });
  //   } else {
  //     console.warn('DeveloperOptions native module not available');
  //   }
  // }, []);

  // 🔥 Get FCM Token Function
  console.log('Firebase apps initialized:', firebase.apps);

  const getFCMToken = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const fcmToken = await messaging().getToken();
        console.log('🔥 Device FCM Token:', fcmToken);
        // You can optionally store or send this token to your backend
      } else {
        console.log('❌ Notification permission not granted');
        Alert.alert(
          '❌ Notification Permission',
          'Please enable notifications in your device settings to receive updates.'
        );
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };

  // 📢 Play Notification Sound
  const playNotificationSound = () => {
    const sound = new Sound('notification.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (!error) {
        sound.play(() => sound.release());
      } else {
        console.log('Sound play error:', error);
      }
    });
  };

  // 🛠️ Setup PushNotification Config
  const configureLocalNotifications = () => {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('🔔 Notification tapped:', notification);
        if (notification.userInteraction && navigationRef.isReady()) {
          navigationRef.navigate('notifiction');
        } else {
          console.warn('Navigation not ready or user didn’t tap');
        }
      },
      requestPermissions: Platform.OS === 'ios',
    });

    // Android only: create notification channel for custom sound
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'custom-sound-channel', // Must match the channelId used in notification
          channelName: 'Custom Sound Channel',
          soundName: 'notification.mp3', // Custom sound file name in raw folder
          importance: 4,
          vibrate: true,
        },
        (created) => console.log('Notification channel created:', created)
      );
    }
  };

  // 📬 Handle Notifications in All App States
  useEffect(() => {
    getFCMToken();
    configureLocalNotifications();

    // Foreground notifications
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('📩 Foreground notification:', remoteMessage);
      playNotificationSound(); // ✅ Play sound

      PushNotification.localNotification({
        channelId: 'custom-sound-channel',
        title: remoteMessage.notification?.title || 'Notification',
        message: remoteMessage.notification?.body || '',
        playSound: true,
        soundName: 'notification.mp3',
        priority: 'high',
        importance: 'high',
        vibrate: true,
      });
    });

    // When app is in background and user taps notification
    const unsubscribeOnOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('🔄 Opened from background:', remoteMessage);
      if (navigationRef.isReady()) {
        navigationRef.navigate('notifiction');
      }
    });

    // When app is opened from killed state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage && navigationRef.isReady()) {
          console.log('💀 Opened from killed state:', remoteMessage);
          navigationRef.navigate('Notifications');
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnOpenedApp();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
