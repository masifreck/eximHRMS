import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  
  const HolidayList = ({navigation}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const checkLoginStatus = async () => {
        try {
          const mobileNo = await AsyncStorage.getItem('mobileNo');
          const token = await AsyncStorage.getItem('access_token');
          const password = await AsyncStorage.getItem('password');
  
          if (!mobileNo || !token) {
            navigation.replace('newlogin');
            return;
          }
  
          const url = `https://hrexim.tranzol.com/fe3e58605c614c36b7946d403c3fa8e7/Holidays?m=${mobileNo}&s=${password}&d=${token}`;
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
 // console.log('response',`https://hrexim.tranzol.com/fe3e58605c614c36b7946d403c3fa8e7/Holidays?m=${mobileNo}s=${password}&d=${token}`)
          if (!response.ok) {
            throw new Error('Invalid response from server');
          }
  
          const AttendanceLatest = await response.json(); // returns a string
          console.log('Raw AttendanceLatest:', AttendanceLatest);
          
          const dat = JSON.parse(AttendanceLatest); // parse string into array
          console.log('Parsed Holidays:', dat);
          
          setData(dat);
          
        } catch (error) {
          console.error('Error fetching employee data:', error.message);
          //navigation.replace('newlogin');
        } finally {
          setLoading(false);
        }
      };
  
      checkLoginStatus();
    }, [navigation]);
  
    const renderItem = ({item}) => (
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Icon name="calendar-star" size={30} color="#fff" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.holidayName}>{item.HolidayName}</Text>
          <Text style={styles.holidayDate}>
            {item.fd === item.td
              ? `Date: ${item.fd}`
              : `From: ${item.fd}  To: ${item.td}`}
          </Text>
        </View>
      </View>
    );
  
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>📅 Holiday List</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item, index) => `${item.HolidayName}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    );
  };
  
  export default HolidayList;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f3f6f9',
      padding: 10,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 12,
      textAlign: 'center',
      color: '#333',
    },
    list: {
      paddingBottom: 20,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      marginVertical: 6,
      borderRadius: 10,
      elevation: 3,
      padding: 10,
      alignItems: 'center',
    },
    iconContainer: {
      backgroundColor: '#007bff',
      borderRadius: 25,
      padding: 10,
      marginRight: 12,
    },
    infoContainer: {
      flex: 1,
    },
    holidayName: {
      fontSize: 18,
      fontWeight: '600',
      color: '#222',
    },
    holidayDate: {
      fontSize: 14,
      color: '#555',
      marginTop: 4,
    },
  });
  