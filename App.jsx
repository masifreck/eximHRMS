import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeModules, Alert } from 'react-native';
import AppNavigator from './src/AppNavigator';

const App = () => {
  const { DeveloperOptions } = NativeModules;

  useEffect(() => {
    if (DeveloperOptions?.isDeveloperOptionsEnabled) {
      DeveloperOptions.isDeveloperOptionsEnabled()
        .then((enabled) => {
          console.log('Developer Options are', enabled ? 'ON' : 'OFF');
          // Optional: show alert
          // Alert.alert('Developer Options', enabled ? 'Enabled' : 'Disabled');
        })
        .catch((error) => {
          console.error('Error checking Developer Options:', error);
        });
    } else {
      console.warn('DeveloperOptions native module not available');
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
