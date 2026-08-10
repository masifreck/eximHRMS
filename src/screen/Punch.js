import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  PermissionsAndroid,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { styles } from './PunchStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import Sound from 'react-native-sound';
import successsound from '../assets/mixkit.wav'
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
//import { checkDeveloperOptions } from '../utiils/checkDeveloperOptions'; // Import the utility function
const Punch = ({ navigation }) => {
  const device = useCameraDevice('front');
  const camera = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [imageSource, setImageSource] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [EmployeeId, setEmployeeId] = useState('');
  const [punchloading, setPuchLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const compressImage = async (imagePath) => {
    const compressedPath = `${RNFS.CachesDirectoryPath}/compressed.jpg`;
  
    await RNFS.copyFile(imagePath, compressedPath); // Convert to JPEG
   // console.log('Compressed Image Path:', compressedPath);
  
    return compressedPath;
  };
    const [isDevModeEnabled, setIsDevModeEnabled] = useState(null);



  // if (isDevModeEnabled === null) {
  //   return null; // or a loader
  // }

  // if (isDevModeEnabled) {
  //   return (
    
  //   );
  // }
  const mapViewRef = React.useRef(null);
  const { hasPermission } = useCameraPermission();
  const getLocation = async () => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message: 'Can we access your location?',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    };

    const checkPermission = async () => {
      try {
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        return granted;
      } catch (err) {
        return false;
      }
    };

    let hasPermission = await checkPermission();

    if (!hasPermission) {
      hasPermission = await requestLocationPermission();
    }

    if (hasPermission) {
      setLoadingLocation(true);
      Geolocation.getCurrentPosition(
        position => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLoadingLocation(false);
        },
        error => {
          Alert.alert('Geolocation Error', error.message);
          console.error('Geolocation error:', error);
          setLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      Alert.alert('Geolocation Permission', 'Please allow access to location for Punch.', [{ text: 'OK' }]);
      navigation.goBack();
    }
  };
  useEffect(() => {
    const getEmployeeId = async () => {
      try {
        const details = await AsyncStorage.getItem("employeeDetails");
        if (details !== null) {
          const parsedDetails = JSON.parse(details);
          console.log('Parsed Employee Details:', parsedDetails);
          setEmployeeId(parsedDetails.EmployeeId); // Access the EmployeeId from the parsed object
                const mobileNo = await AsyncStorage.getItem('mobileNo');
                const token = await AsyncStorage.getItem('access_token');
        }
      } catch (error) {
        console.error('Error retrieving EmployeeId:', error);
      }
      
    };

    getEmployeeId();
    getLocation();
  }, []);
  const showAlert = () => {
    Alert.alert(
      'Info',
      'Restart App after Permissions',
      [
        {
          text: 'OK',
          onPress: () => checkAndRequestCameraPermission(),
        },
      ],
      {cancelable: false},
    );
  };
  async function checkAndRequestCameraPermission() {
    console.log('restart kindly===========================================');
    console.log(
      PermissionsAndroid.RESULTS.GRANTED,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    try {
      // Check if the permission is already granted
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      if (granted) {
        console.log('Camera permission already granted');
        return PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // If permission is not granted, request it
        const requestResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'Note : After Accepting, It restarts',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (requestResult === PermissionsAndroid.RESULTS.GRANTED) {
          RNRestart.restart();
          console.log('Camera permission granted');
          console.log(
            'restart kindly===========================================',
          );
          console.log(
            PermissionsAndroid.RESULTS.GRANTED,
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );
        } else {
          console.log('Camera permission denied');
          // Optionally, you can show an alert to inform the user
          setModalMessage('You denied camera access. This app requires camera access to function properly.');
          setIsModalVisible(true);

        
        }

        return requestResult;
      }
    } catch (error) {
      console.error(`Error checking/requesting camera permission: ${error}`);
      return PermissionsAndroid.RESULTS.DENIED;
    }
  }
  const NoCameraErrorView = () => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text
        style={{
          color: '#276A76',
          textAlign: 'center',
          //fontSize: isFine ? 13 : 15,

          textTransform: 'uppercase',
          fontFamily: 'PoppinsBold',
          marginTop: 5,
          letterSpacing: 1,
        }}>
        Allow Camera Permission
      </Text>
      <TouchableOpacity style={styles.button2} onPress={showAlert}>
        <Text style={styles.text}>Allow</Text>
      </TouchableOpacity>
    </View>
  );

 

  if (!hasPermission) {
    // Handle permission denied case
    console.log('Permission denied');
    return <NoCameraErrorView />;
  }


 
  const resizeImage = async (imagePath) => {
    try {
      if (!imagePath) {
        throw new Error("Image path is undefined!");
      }
  
      console.log("📂 Processing Image Path:", imagePath);
  
      const resizedImage = await ImageResizer.createResizedImage(
        imagePath,
        1080, // New width
        1080, // New height
        "JPEG", // Format
        10, // Quality (0-100)
        0, // Rotation
        undefined, // Output path (optional)
        false, // Keep metadata
      );
  
      if (!resizedImage.uri) {
        throw new Error("Failed to get resized image path!");
      }
  
      console.log("✅ Resized Image Path:", resizedImage.uri);
      return resizedImage.uri;
    } catch (error) {
      console.error("🚨 Image Processing Error:", error);
      return imagePath; // Return original image if resizing fails
    }
  };
 
const capturePhoto = async () => {
  if (camera.current !== null) {
    try {
      //console.log("📸 Capturing photo...");

      const photo = await camera.current.takePhoto({
        qualityPrioritization: "balanced",
        skipMetadata: true,
      });

     // console.log("✅ Photo captured:", photo);

      if (!photo?.path) {
        console.error("❌ No photo path received!");
        return;
      }

      setImageSource(photo.path);
      //console.log("🖼 Original Image Path:", photo.path);

      // Resize Image
      const resizedPath = await resizeImage(photo.path);

      if (!resizedPath) {
        console.error("❌ Resized image path is undefined!");
        return;
      }

      // Get Final Image Size
      const fileInfo = await RNFS.stat(resizedPath);
      const fileSizeInKB = (fileInfo.size / 1024).toFixed(2);

      // console.log(`📂 Final Image Path: ${resizedPath}`);
      // console.log(`📏 Final Image Size: ${fileSizeInKB} KB`);

    setShowCamera(false)
      setImageSource(resizedPath);
      
    } catch (error) {
      console.error("🚨 Capture Error:", error);
    }
  } else {
    console.error("🚨 Camera ref is null!");
  }
};
  

  Sound.setCategory('Playback'); // Ensures the sound plays even in silent mode

  const successSound = new Sound(successsound, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load the sound', error);
      return;
    }
    console.log('Sound loaded successfully');
    console.log('Sound duration: ', successSound.getDuration());
  });
  const playSuccessSound = () => {
    successSound.play((success) => {
      if (success) {
        console.log('Sound played successfully');
      } else {
        console.log('Playback failed due to audio decoding errors');
        successSound.reset()  // Reset to avoid playback issues on next attempt
      }
    });
  }
 
  const postPunchData = async (
  EmployeeId,
  latitude,
  longitude,
  imageSource,
  setPuchLoading,
) => {
  try {
    // ==========================
    // CHECK MOCK LOCATION FIRST
    // ==========================
    const isMockLocation = await new Promise(resolve => {
      Geolocation.getCurrentPosition(
        position => {
          console.log('📍 Location:', position);

          if (position?.mocked === true) {
            Alert.alert(
              '🚫 Security Alert',
              'Mock location detected.\n\nPlease disable Fake GPS / Mock Location and try again.',
            );
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error => {
          console.log('Location Error:', error);

          Alert.alert(
            'Location Error',
            'Unable to verify your location. Please enable GPS and try again.',
          );

          resolve(true); // block attendance if location check fails
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          forceRequestLocation: true,
        },
      );
    });

    if (isMockLocation) {
      return;
    }

    // ==========================
    // VALIDATIONS
    // ==========================
    if (!latitude || !longitude || !imageSource || !EmployeeId) {
      Alert.alert(
        'Missing Information',
        'Please ensure all fields are filled.',
      );
      return;
    }

    const token = await AsyncStorage.getItem('access_token');

    if (!token) {
      Alert.alert('Token Missing', 'Please log in again.');
      return;
    }

    // ==========================
    // IMAGE PATH
    // ==========================
    const cleanImagePath = imageSource.startsWith('file://')
      ? imageSource
      : `file://${imageSource}`;

    // ==========================
    // FORM DATA
    // ==========================
    const formData = [
      {
        name: 'EmployeeId',
        data: EmployeeId.toString(),
      },
      {
        name: 'Latitude',
        data: latitude.toString(),
      },
      {
        name: 'Longitude',
        data: longitude.toString(),
      },
      {
        name: 'MapUrl',
        data: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      },
      {
        name: 'image',
        filename: 'selfie.jpg',
        type: 'image/jpeg',
        data: RNFetchBlob.wrap(cleanImagePath),
      },
    ];

    setPuchLoading(true);

    console.log('Sending FormData:', formData);

    const response = await RNFetchBlob.fetch(
      'POST',
      'https://hrexim.tranzol.com/api/Attendance/EmployeeAttendance',
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      formData,
    );

    const status = response.info().status;
    const rawResponse = response.json();

    console.log('Status:', status);
    console.log('Raw Response:', rawResponse);

    if (
      status === 200 &&
      rawResponse.result ===
        'Attendance Uploaded Successfully'
    ) {
      await AsyncStorage.setItem(
        'punchIn',
        JSON.stringify(true),
      );

      await AsyncStorage.setItem(
        'lastPunchIn',
        `Punch : ${new Date().toISOString()}`,
      );

      playSuccessSound();

      Alert.alert(
        '✅ Punch Success',
        'Your punch is successful.',
      );

      navigation.replace('DrawerNavigation');
    } else {
      Alert.alert(
        'Unexpected Response',
        rawResponse?.result ||
          'Attendance upload failed.',
      );
    }
  } catch (error) {
    console.error('❌ Error during punch:', error);

    Alert.alert(
      'Error',
      'Something went wrong while posting your punch.',
    );
  } finally {
    setPuchLoading(false);
  }
};
  
  
  
  ;
  return (
    <>
    {isDevModeEnabled  ? (
        <View style={styles.blockerContainer}>
        <Image
          source={require('../assets/warning-sign.png')} // Replace with your image
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.warningText}>
          Please turn off your developer option to continue punching
        </Text>

        <Text style={styles.instructions}>
          🛠️ Go to <Text style={styles.bold}>Settings {'>'} Developer options</Text> and disable it.
        </Text>
      </View>
    )
  :
  (

    <View style={styles.container}>
      <View style={styles.mapcontainer}>
        <MapView
          ref={mapViewRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005,
    longitudeDelta: 0.005,
          }}
        >
          <Marker coordinate={{ latitude, longitude }} />
        </MapView>
        <View>
          <View style={[styles.ImgContainer, { backgroundColor: '#f4d9ff' }]}>
            {imageSource !== '' ? (
              <Image
                style={styles.Image}
                source={{ uri: `file://${imageSource}` }}
              />
            ) : (
              <Image source={require('../../src/assets/selfie(1).png')} style={{ width: 150, height: 150, marginRight: 50, marginTop: 30 }} />
            )}
          </View>
        </View>
      </View>
      <View style={{ marginTop: 50 }}>
        <Text style={styles.text}>
        📍 Longitude    : {loadingLocation ? <ActivityIndicator size="small" color="#0000ff" />    :    longitude}
        </Text>
        <Text style={styles.text}>
        📍 Latitude        : {loadingLocation ? <ActivityIndicator size="small" color="#0000ff" /> : latitude}
        </Text>
        <Text style={styles.text}>🆔 EmployeeId : {EmployeeId}</Text>
      </View>
      <View style={styles.btnView}>
        <TouchableOpacity style={styles.btn} onPress={() => setShowCamera(true)}>
          <Text style={styles.txt}>Take Selfie</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=>postPunchData(EmployeeId, latitude, longitude, imageSource, setPuchLoading)} disabled={punchloading}>
          {punchloading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.txt}>Punch</Text>
          )}
        </TouchableOpacity>
      </View>
      {showCamera && (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={showCamera}
            photo={true}
            mirrorImage={true}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.camButton} onPress={capturePhoto} />
          </View>
        </>
      )}
    
    </View>
      )
  }
    </>
  );

};

export default Punch;
