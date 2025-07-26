import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { textcolor } from '../constants/color';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]); // ✅ Store notifications

  useEffect(() => {
    getEmployeeNotifications();
  }, []); // ✅ Add dependency array to avoid multiple calls

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
          console.log('✅ Notification Data:', data);

          // ✅ Map API response to match UI
          const formattedData = data.map(item => ({
            id: item.Id,
            title: item.MessageTitle,
            body: item.Messagetext,
            date: item.MessageDateTime,
            isRead: item.IsRead,
            type: 'message', // default type; update if you have other types
            fullItem: item, // preserve original item if needed in detail screen
          }));

          setNotifications(formattedData);
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

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleNotificationPress = (item) => {
    markAsRead(item.id);
    navigation.navigate('NotificationDetail', { notification: item.fullItem });
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem, item.isRead ? styles.read : styles.unread]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.row}>
        <View style={styles.iconTitleRow}>
          <Icon
            name={getIconName(item.type)}
            size={22}
            color={item.isRead ? '#999' : '#007AFF'}
            style={styles.icon}
          />
          <Text style={styles.title}>{item.title}</Text>
        </View>
        {!item.isRead && (
          <Icon name="circle" size={10} color="red" style={styles.unreadIcon} />
        )}
      </View>
      <Text style={styles.body}>{item.body}</Text>
      <View style={styles.dateRow}>
        <Icon name="calendar" size={14} color="gray" />
        <Text style={styles.date}> {item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No notifications found.</Text>}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
  notificationItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  read: {
    backgroundColor: '#f5f5f5',
  },
  unread: {
    backgroundColor: '#e0f7fa',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  unreadIcon: {
    marginLeft: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color:textcolor,

  },
  body: {
    marginTop: 5,
    fontSize: 14,
    color:textcolor
  },
  dateRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: 'gray',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});
