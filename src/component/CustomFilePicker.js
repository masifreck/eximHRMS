// CustomFilePicker.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { launchImageLibrary } from 'react-native-image-picker';

const CustomFilePicker = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const openPickerModal = () => setModalVisible(true);
  const closePickerModal = () => setModalVisible(false);

  const handlePickImage = async () => {
    closePickerModal();
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.assets?.length > 0) {
        const img = result.assets[0];
        setSelectedFile({
          uri: img.uri,
          name: img.fileName,
          type: img.type,
          isPdf: false,
        });
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handlePickPDF = async () => {
    closePickerModal();
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });

      setSelectedFile({
        uri: res.uri,
        name: res.name,
        type: res.type,
        isPdf: true,
      });
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.pickerBtn} onPress={openPickerModal}>
        <Text style={styles.btnText}>Choose File</Text>
      </TouchableOpacity>

      {selectedFile && (
        <View style={styles.preview}>
          {selectedFile.isPdf ? (
            <Text style={styles.fileText}>📄 {selectedFile.name}</Text>
          ) : (
            <Image source={{ uri: selectedFile.uri }} style={styles.imagePreview} />
          )}
        </View>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={closePickerModal}
          activeOpacity={1}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.optionBtn} onPress={handlePickImage}>
              <Text style={styles.optionText}>📷 Pick Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionBtn} onPress={handlePickPDF}>
              <Text style={styles.optionText}>📄 Pick PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={closePickerModal}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomFilePicker;

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 50 },
  pickerBtn: {
    backgroundColor: '#0080ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  btnText: { color: '#fff', fontSize: 16 },

  preview: { marginTop: 20, alignItems: 'center' },
  imagePreview: { width: 200, height: 200, resizeMode: 'contain' },
  fileText: { fontSize: 16, color: '#333' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  optionBtn: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  optionText: { fontSize: 18 },
  cancelBtn: { marginTop: 10, paddingVertical: 15 },
  cancelText: { textAlign: 'center', color: 'red', fontSize: 16 },
});
