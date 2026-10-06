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

const SingleFilePicker = ({ onFileSelected }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const openPickerModal = () => setModalVisible(true);

  const closePickerModal = () => setModalVisible(false);

  // ----------------------------------
  // PICK ONLY ONE IMAGE
  // ----------------------------------
  const handlePickImage = async () => {
    closePickerModal();

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1, // ONLY ONE IMAGE
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert(
          'Error',
          result.errorMessage || 'Unable to select image.'
        );
        return;
      }

      if (result.assets?.length > 0) {
        const img = result.assets[0];

        const newFile = {
          uri: img.uri,
          name:
            img.fileName ||
            `image_${Date.now()}.jpg`,
          type: img.type || 'image/jpeg',
          isPdf: false,
        };

        // Replace existing files with selected image
        const updated = [newFile];

        setSelectedFiles(updated);

        onFileSelected?.(updated);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error?.message || 'Unable to select image.'
      );
    }
  };

  // ----------------------------------
  // PICK PDFs
  // ----------------------------------
  const handlePickPDFs = async () => {
    closePickerModal();

    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf],
      });

      const newFiles = res.map(doc => ({
        uri: doc.uri,
        name: doc.name,
        type: doc.type || 'application/pdf',
        isPdf: true,
      }));

      const totalFiles =
        selectedFiles.length + newFiles.length;

      if (totalFiles > 6) {
        Alert.alert(
          'Limit Reached',
          'You can select a maximum of 6 files.'
        );
        return;
      }

      const updated = [
        ...selectedFiles,
        ...newFiles,
      ];

      setSelectedFiles(updated);

      onFileSelected?.(updated);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        Alert.alert(
          'Error',
          error?.message || 'Unable to select PDF.'
        );
      }
    }
  };

  // ----------------------------------
  // REMOVE FILE
  // ----------------------------------
  const removeFile = index => {
    const updated = selectedFiles.filter(
      (_, i) => i !== index
    );

    setSelectedFiles(updated);

    onFileSelected?.(updated);
  };

  // ----------------------------------
  // FILE PREVIEW
  // ----------------------------------
  const renderFile = ({ item, index }) => (
    <View style={styles.fileContainer}>
      {item.isPdf ? (
        <View style={styles.pdfPreview}>
          <Icon
            name="picture-as-pdf"
            size={32}
            color="#E53935"
          />

          <Text
            style={styles.fileText}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </View>
      ) : (
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.uri }}
            style={styles.imagePreview}
          />

          <Text
            style={styles.fileText}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => removeFile(index)}
        style={styles.crossBtn}
      >
        <Icon
          name="cancel"
          size={20}
          color="#EF4444"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* PICKER BUTTON */}
      <TouchableOpacity
        style={styles.pickerBtn}
        onPress={openPickerModal}
        activeOpacity={0.8}
      >
        <Icon
          name="attach-file"
          size={20}
          color="#FFFFFF"
        />

        <Text style={styles.btnText}>
          Choose Files
        </Text>
      </TouchableOpacity>

      {/* SELECTED FILES */}
      <FlatList
        data={selectedFiles}
        keyExtractor={(_, index) =>
          index.toString()
        }
        renderItem={renderFile}
        contentContainerStyle={
          styles.previewList
        }
      />

      {/* PICKER MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closePickerModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={closePickerModal}
          activeOpacity={1}
        >
          <View
            style={styles.modalContainer}
            onStartShouldSetResponder={() =>
              true
            }
          >

            {/* IMAGE */}
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={handlePickImage}
              activeOpacity={0.7}
            >
              <Icon
                name="photo-library"
                size={23}
                color={primaryColor}
              />

              <Text style={styles.optionText}>
                Pick Image
              </Text>
            </TouchableOpacity>

            {/* PDF */}
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={handlePickPDFs}
              activeOpacity={0.7}
            >
              <Icon
                name="picture-as-pdf"
                size={23}
                color="#E53935"
              />

              <Text style={styles.optionText}>
                Pick PDFs
              </Text>
            </TouchableOpacity>

            {/* CANCEL */}
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={closePickerModal}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
};

export default SingleFilePicker;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },

  pickerBtn: {
    backgroundColor: primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  previewList: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },

  fileContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  imageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 30,
  },

  imagePreview: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 7,
    marginRight: 10,
  },

  pdfPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 30,
  },

  fileText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },

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
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  optionBtn: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  optionText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },

  cancelBtn: {
    marginTop: 10,
    paddingVertical: 15,
  },

  cancelText: {
    textAlign: 'center',
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
});