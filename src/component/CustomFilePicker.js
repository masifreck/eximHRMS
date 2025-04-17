import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { primaryColor } from '../constants/color';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomFilePicker = ({ onFileSelected }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const openPickerModal = () => setModalVisible(true);
  const closePickerModal = () => setModalVisible(false);

  const handlePickImages = async () => {
    closePickerModal();
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 0, // allow multiple images
      });

      if (result.assets?.length > 0) {
        const files = result.assets.map((img) => ({
          uri: img.uri,
          name: img.fileName || `image_${Date.now()}.jpg`,
          type: img.type || 'image/jpeg',
          isPdf: false,
        }));

        const updated = [...selectedFiles, ...files];
        setSelectedFiles(updated);
        onFileSelected?.(updated); // Send updated list to parent
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handlePickPDFs = async () => {
    closePickerModal();
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf],
      });

      const files = res.map((doc) => ({
        uri: doc.uri,
        name: doc.name,
        type: doc.type || 'application/pdf',
        isPdf: true,
      }));

      const updated = [...selectedFiles, ...files];
      setSelectedFiles(updated);
      onFileSelected?.(updated);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const removeFile = (index) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFileSelected?.(updated);
  };

  const renderFile = ({ item, index }) => (
    <View style={styles.fileContainer}>
      {item.isPdf ? (
        <Text style={styles.fileText}>📄 {item.name}</Text>
      ) : (
        <Image source={{ uri: item.uri }} style={styles.imagePreview} />
      )}
      <TouchableOpacity onPress={() => removeFile(index)} style={styles.crossBtn}>
        <Icon name="cancel" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.pickerBtn} onPress={openPickerModal}>
        <Text style={styles.btnText}>Choose Files</Text>
      </TouchableOpacity>

      <FlatList
        data={selectedFiles}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderFile}
        contentContainerStyle={styles.previewList}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={closePickerModal}
          activeOpacity={1}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.optionBtn} onPress={handlePickImages}>
              <Text style={styles.optionText}>📷 Pick Images</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionBtn} onPress={handlePickPDFs}>
              <Text style={styles.optionText}>📄 Pick PDFs</Text>
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
  container: { alignItems: 'center', marginTop: 20 },
  pickerBtn: {
    backgroundColor: primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16 },
  previewList: { marginTop: 20, width: '100%', alignItems: 'center' },
  fileContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    position: 'relative',
  },
  imagePreview: { width: 60, height: 60, resizeMode: 'cover', borderRadius: 5 },
  fileText: { fontSize: 16, color: '#333' },
  crossBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
  },
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
