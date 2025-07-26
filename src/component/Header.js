import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get('window');

const Header = () => {
  const navigation = useNavigation();
  const [unreadCount, setUnreadCount] = useState(0); // ✅ Unread count state

  StatusBar.setBarStyle('dark-content', true);
  StatusBar.setBackgroundColor('#e8d7f5');

  useEffect(() => {
    getEmployeeNotifications(); // ✅ Call on mount
  }, []);

  const getEmployeeNotifications = async () => {
    try {
      const [employeeDetailsJson, accessToken] = await Promise.all([
        AsyncStorage.getItem('employeeDetails'),
        AsyncStorage.getItem('access_token'),
      ]);

      const employeeDetails = employeeDetailsJson ? JSON.parse(employeeDetailsJson) : null;

      if (employeeDetails && accessToken) {
        const employeeId = employeeDetails.EmployeeId;
        const apiUrl = `https://hrexim.tranzol.com/api/Employee/GetEmployeeNotification?employeeId=${employeeId}`;

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Count unread notifications
          const unread = data.filter(item => item.IsRead === false).length;
          setUnreadCount(unread);
        } else {
          console.error('❌ API error:', response.status, response.statusText);
        }
      } else {
        console.warn('⚠️ Missing employeeDetails or access_token');
      }
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
    }
  };

  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row' }}>
        {/* <TouchableOpacity style={styles.threeDot} onPress={()=>{navigation.openDrawer()}}>
          <Image style={styles.threeDotImg} source={require('../assets/menus.png')} />
        </TouchableOpacity> */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            style={{ height: 26, width: 180, marginLeft: 10, tintColor: 'black' }}
            source={require('../assets/people-builder.png')}
          />
        </View>
      </View>

      <TouchableOpacity onPress={() => { }} style={styles.scanButton} />

      <TouchableOpacity
        onPress={() => navigation.navigate('notifiction')}
        style={styles.notificationWrapper}
      >
        <Image
          source={require('../assets/notification.png')}
          style={styles.scanButton}
        />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.openDrawer()} style={[styles.scanButton, { marginRight: 10 }]}>
        <Image source={require('../assets/menu.png')} style={styles.scanButton} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: width,
    height: 60,
    backgroundColor: '#e8d7f5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txt: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scanButton: {
    height: 20,
    width: 20,
    marginVertical: 8,
    tintColor: 'black',
  },
  threeDotImg: {
    height: 20,
    width: 20,
    tintColor: '#1e4175',
    alignSelf: 'center',
  },
  notificationWrapper: {
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    right: -12,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 4,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;
