import {View, Text, StyleSheet, Image, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import splash_Animation from '../src/assets/loading.json';
const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Retrieve mobile number and token from AsyncStorage
        const mobileNo = await AsyncStorage.getItem('mobileNo');
        const token = await AsyncStorage.getItem('access_token');

        // If token or mobile number is missing, navigate to login
        if (!mobileNo || !token) {
          navigation.replace('newlogin');
          return;
        }

        // Call the API with the mobile number and bearer token
        const url = `https://hrexim.tranzol.com/api/Employee/get?mobileno=${mobileNo}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Invalid response from server');
        }

        const data = await response.json();

        // Store the response in AsyncStorage
        await AsyncStorage.setItem('employeeDetails', JSON.stringify(data));
        // If the response contains valid employee data, navigate to the home screen
        if (data.EmployeeId) {
          navigation.replace('DrawerNavigation');
        } else {
          // If data is invalid, navigate to login
          navigation.replace('newlogin');
        }
      } catch (error) {
        console.error('Error fetching employee data:', error.message);
        // Navigate to login on error
        navigation.replace('newlogin');
      }
    };

    // Add a delay to simulate a splash screen
    setTimeout(checkLoginStatus, 3000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.upper}>
        <Image
          source={require('../src/assets/mypic.jpeg')}
          style={{width: '50%', height: '50%'}}
          resizeMode="contain"
        />
          <Text style={styles.company_name}>HR MS</Text>
      </View>
   <LottieView
   source={splash_Animation}
    autoPlay
    loop
    style={{width: '20%', height: '20%'}}
   />

    
      
      <View style={styles.lower}>
        <Text style={styles.tranzol}>Powered By Tranzol</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aa18ea',
    paddingTop: StatusBar.currentHeight || 0,
  },
  upper: {
    flex: 25,
    marginTop: '10%',
    marginHorizontal: '5%',
    backgroundColor: '#aa18ea',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  lower: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  company_name: {
    fontFamily: 'PoppinsExtraBold',
    color: '#eeeeee',
    fontSize: 30,
    textAlign: 'center',
    letterSpacing: 5,
  },
  tranzol: {
    fontSize: 10,
    position: 'absolute',
    bottom: 30,
    letterSpacing: 1,
    textAlign: 'center',
    fontFamily: 'PoppinsExtraBold',
    color: '#eeeeee',
  },
});

export default Splash;
