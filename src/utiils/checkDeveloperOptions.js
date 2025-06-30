import { NativeModules } from 'react-native';

const { DeveloperOptions } = NativeModules;

export const checkDeveloperOptions = async () => {
  if (DeveloperOptions?.isDeveloperOptionsEnabled) {
    try {
      const enabled = await DeveloperOptions.isDeveloperOptionsEnabled();
      return enabled; // true or false
    } catch (error) {
      console.error('Error checking Developer Options:', error);
      return false;
    }
  } else {
    console.warn('DeveloperOptions native module not available');
    return false;
  }
};
