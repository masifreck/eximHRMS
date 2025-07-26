import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  Image 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import React, { useState,useEffect } from 'react';
import { primaryColor, textcolor } from '../constants/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../component/Loading';
import ResponseModal from '../component/Model';
import { useCustomBackHandler } from '../component/BackHandler';
import { getFCMToken } from '../utiils/notifications';
const Newlogin = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const { ExitModal } = useCustomBackHandler();
  const [showPassword, setShowPassword] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getFCMToken();
      if (token) {
        setFcmToken(token);
        console.log('FCM Token:', token);
        // You can now send token to your server or store it
      }
    };

    fetchToken();
  }, []);
  // Validation function for username and password
  const handleModalClose = () => {
    setIsModalVisible(false);
    setModalMessage('');
  };
  const validateInputs = () => {
    if (!username.trim() || !password.trim()) {
      setModalMessage('Username and password cannot be empty.');
      setIsModalVisible(true);
      return false;
    }
    if(!fcmToken){
        setModalMessage('FCM Token is not available. Please check your internet connection or app permissions.');
      setIsModalVisible(true);
      return false;
    }
     const token = getFCMToken();
 console.log('FCM Token:', token);
    return true;
  };

  const myFetchPostRequest = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    const url = `https://hrexim.tranzol.com/api/ApiLogin/Login?username=${username}&password=${password}&deviceId=${fcmToken}`;
console.log('url',url)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
console.log('response',response)
      if (!response.ok) {
        throw new Error('Invalid credentials. Please try again.');
      }

      const data = await response.json();

      if (data.access_token) {
        // Save the token to AsyncStorage
        await AsyncStorage.setItem('access_token', data.access_token);
        await AsyncStorage.setItem('mobileNo', username);
        await AsyncStorage.setItem('password',password);
        await AsyncStorage.setItem('userId', data.userId.toString());
        navigation.replace('splash'); 
      } else {
        setModalMessage('Unexpected response from server.');
        setIsModalVisible(true);
      }
    } catch (error) {
      setModalMessage(error.message);
      setIsModalVisible(true);
      console.log(error.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      style={{ resizeMode: 'cover', flex: 1 }} 
      source={require('../assets/loginbg.jpg')}
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          <View style={styles.container}>
            <Image style={styles.logo} source={require('../assets/mypic.jpeg')} />
            <TextInput 
              style={styles.input}
              placeholder='Enter Username'
              value={username}
              keyboardType='numeric'
              onChangeText={(t) => setUsername(t)}
            />
           <View style={styles.passwordContainer}>
  <TextInput 
    style={styles.passwordInput}
    placeholder='Enter Password'
    value={password}
    onChangeText={(t) => setPassword(t)}
    secureTextEntry={!showPassword}
  />
  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
  <Ionicons 
  name={showPassword ? 'eye' : 'eye-off'} 
  size={22} 
  color="#888" 
/>

  </TouchableOpacity>
</View>

            <TouchableOpacity 
              style={styles.loginbtn}
              onPress={myFetchPostRequest}
            >
              <Text style={styles.btntext}>LOG IN</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: primaryColor, height: 50, paddingTop: 10 }}>
            <Text style={styles.tranzol}>POWERED BY TRANZOL</Text>
          </View>
        </>
      )}
      <ResponseModal 
          isVisible={isModalVisible}
          onClose={handleModalClose}
          responseText={modalMessage}
      />
      <ExitModal/>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '90%',
    backgroundColor: '#fff',
    elevation: 4,
    height: 50,
    borderRadius: 10,
    borderColor: primaryColor,
    marginTop: 30,
    paddingHorizontal: 20,
    color: textcolor,
    fontSize:16
  },
  logo: {
    width: 120,
    height: 120,
  },
  loginbtn: {
    backgroundColor: primaryColor,
    width: '85%',
    height: 50,
    borderRadius: 15,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  btntext: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#fff',
    elevation: 4,
    height: 50,
    borderRadius: 10,
    borderColor: primaryColor,
    marginTop: 30,
    paddingHorizontal: 20,
  },
  
  passwordInput: {
    flex: 1,
    color: textcolor,
    fontSize: 16,
  },
  
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#888',
  },
  
  tranzol: {
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'white',
    elevation: 4,
    paddingBottom: 10,
  },
});

export default Newlogin;