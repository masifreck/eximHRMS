import { View, Text, ScrollView, TouchableOpacity, PermissionsAndroid, Alert,ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../component/Header'
import PunchBtn from '../component/PunchBtn'
import { useNavigation } from '@react-navigation/native'
import AttnHistory from './AttnHistory'
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage'
import HomeCrads from '../component/HomeCrads'

const Home = (route) => {
  const [lastActionData,setLastActionData]=useState('')
const [isLoading,setIsLoading]=useState(false)
const RefreshLastAction = async () => {
  try {
    setIsLoading(true); // Start loading
    const data = await AsyncStorage.getItem('lastPunchIn'); // Fetch punch-in details

    if (data) {
      //console.log('Retrieved Last Punch Data:', data); // Log for debugging

      // Extract the date and time from the stored format
      const [actionType, dateTime] = data.split(': '); // Split the string at ": "
      if (actionType && dateTime) {
        const formattedDateTime = new Date(dateTime).toLocaleString(); // Format date-time to local
        setLastActionData(`${actionType}: ${formattedDateTime}`);
        console.log('data',lastActionData) // Combine action type and formatted date
      } else {
        setLastActionData('Invalid data format'); // Fallback for unexpected formats
      }
    } else {
      console.log('No punch-in details found'); // Log if no data
      setLastActionData('No data available'); // Set state to indicate no data
    }
  } catch (error) {
    console.error('Error fetching last punch data:', error);
  } finally {
    setIsLoading(false); // Stop loading
  }
};


  useEffect(() => {
    // Function to get permission for location
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message: 'We need to access your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log('granted', granted);
        if (granted === 'granted') {
          console.log('You can use Geolocation');
        } else {
          console.log('You cannot use Geolocation');
          Alert.alert('Geolocation Permission', 'Please allow to access location for Punch , Otherwise you can not Punch.', [
            { text: 'OK', onPress: async () => console.log("ok") },
          ]);
        }
      } catch (err) {
        console.log('Error :', err);
      }
    };
    requestLocationPermission();
    RefreshLastAction()
  }, []);
  useEffect(() => {
    if (route.params?.lastPunchIn) {
      setLastActionData(route.params.lastPunchIn);
      console.log('route',lastActionData)
    }
  }, [route.params?.lastPunchIn]);

  const navigation = useNavigation()

  const [isScrolling, setIsScrolling] = useState(true);

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    if (contentOffset.y !== 0) {
      setIsScrolling(true);
    } else {
      setIsScrolling(false);
    }
  };

  return (
    <View style={{ height: '100%' }}>
      <View style={{
        backgroundColor: '#e8d7f5',
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        shadowColor: 'black',
        shadowOffset: {
          width: 1,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
        <Header />
   
        <View >
        
        </View>
        <View style={{ paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#3e0961' }}>
  <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
    {/* LAST ACTION text with icon */}
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <AntDesign name="clockcircle" size={18} color="#ffffff" style={{ marginRight: 8 }} />
      <Text style={{ fontSize: 16, color: '#ffffff', fontWeight: 'bold' }}>LAST ACTION:</Text>
    </View>

    {/* Refresh button with icon */}
    <TouchableOpacity
      onPress={RefreshLastAction}
      style={{
        width: 70,
        height: 35,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        elevation: 4,
      }}
    >
      <AntDesign name="retweet" size={30} color="#3e0961" />
    </TouchableOpacity>
  </View>

  {/* Last action display */}
  {isLoading ? (
    <ActivityIndicator size="small" color="#ffffff" />
  ) : (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
      <AntDesign name="checkcircle" size={18} color="#ffffff" style={{ marginRight: 8 }} />
      <Text style={{ fontSize: 16, color: '#ffffff', fontWeight: 'bold' }}>
        {lastActionData ? lastActionData : 'Null'}
      </Text>
    </View>
  )}
</View>
      </View>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16} >

<HomeCrads/>

      </ScrollView>
      <PunchBtn isScrolliing={isScrolling}/>

    </View>
  )
}

export default Home