import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

const MockLocationDetected = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📍🚫</Text>

      <Text style={styles.title}>
        Mock Location Detected
      </Text>

      <Text style={styles.message}>
        This HRMS application requires your real GPS location.
        Please disable any mock location application and
        turn off location spoofing before continuing.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openSettings()}>
        <Text style={styles.buttonText}>
          Open Settings ⚙️
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MockLocationDetected;