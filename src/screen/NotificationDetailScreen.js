import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { textcolor } from '../constants/color';

const NotificationDetailScreen = ({ route }) => {
  const { notification } = route.params;
  const navigation = useNavigation();
  const [isRead, setIsRead] = useState(notification.IsRead); // Track local read state

  useEffect(() => {
    if (!notification.IsRead) {
      markNotificationAsRead();
    }
  }, []);

  const markNotificationAsRead = async () => {
    try {
      const employeeDetailsJson = await AsyncStorage.getItem('employeeDetails');
      const accessToken = await AsyncStorage.getItem('access_token');
      const employeeDetails = employeeDetailsJson ? JSON.parse(employeeDetailsJson) : null;

      if (employeeDetails && accessToken) {
        const employeeId = employeeDetails.EmployeeId;
        const notificationId = notification.Id;
        const apiUrl = `https://hrexim.tranzol.com/api/Employee/MarkNotificationAsRead?employeeId=${employeeId}&notificationId=${notificationId}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          console.log('✅ Notification marked as read');
          setIsRead(true);
        } else {
          console.error('❌ Failed to mark notification as read', response.status);
        }
      } else {
        console.warn('⚠️ Missing employeeDetails or access_token');
      }
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  const getIconName = (type) => {
    switch (type) {
      case 'message':
        return 'message-text-outline';
      case 'reminder':
        return 'calendar-clock';
      case 'update':
        return 'update';
      default:
        return 'bell-outline';
    }
  };

  return (
    <View style={styles.container}>
    

      <View style={styles.headerRow}>
        <Icon name={getIconName(notification.type || 'message')} size={28} color="#007AFF" />
        <Text style={styles.title}>  {notification.MessageTitle}</Text>
      </View>

      <Text style={styles.body}>{notification.Messagetext}</Text>

      <View style={styles.infoRow}>
        <Icon name="calendar" size={16} color="gray" />
        <Text style={styles.infoText}> {notification.MessageDateTime}</Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name={isRead ? 'eye' : 'eye-off'} size={16} color="gray" />
        <Text style={styles.infoText}> {isRead ? 'Read' : 'Unread'}</Text>
      </View>
    </View>
  );
};

export default NotificationDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color:textcolor
  },
  body: {
    fontSize: 18,
    marginBottom: 20,
    color:textcolor
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 5,
  },
});
