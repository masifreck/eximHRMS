import React, { useState, useCallback } from 'react';
import { BackHandler, Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { primaryColor,textcolor } from '../constants/color';

export const useCustomBackHandler = () => {
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);

  const handleBackPress = () => {
    setIsExitModalVisible(true);
    return true; // Prevent default back navigation
  };

  useFocusEffect(
    useCallback(() => {
      // Register the back handler when screen is focused
      const backHandlerListener = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress
      );

      return () => {
        // Remove the back handler when screen is unfocused
        backHandlerListener.remove();
      };
    }, [])
  );

  const ExitModal = () => (
    <Modal
      transparent={true}
      visible={isExitModalVisible}
      onRequestClose={() => setIsExitModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Are you sure you want to exit?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsExitModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exitButton}
              onPress={() => BackHandler.exitApp()}
            >
              <Text style={styles.exitText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return { ExitModal };
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color:textcolor
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelText: {
    color: textcolor,
    textAlign:'center',
    fontWeight:'bold',
    fontSize:16
  },
  exitButton: {
    padding: 10,

    borderRadius: 5,
  },
  exitText: {
    color: textcolor,
    textAlign:'center',
    fontWeight:'bold',
    fontSize:16
  },
});
