import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { textcolor } from '../constants/color';

const Leave = () => {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const [leaves, setLeave] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaveData = async () => {
    try {
      setRefreshing(true);
      const token = await AsyncStorage.getItem('access_token');
      const details = await AsyncStorage.getItem('employeeDetails');

      if (details !== null) {
        const parsedDetails = JSON.parse(details);
        const employeeId = parsedDetails.EmployeeId;
        const url = `https://hrexim.tranzol.com/api/Leave/GetLeave?EmployeeId=${employeeId}`;
        console.log('Fetching leave from:', url);

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

        const LeaveDetails = await response.json();
        setLeave(LeaveDetails?.data?.Result || []);
        //console.log(leaves)
      }
    } catch (error) {
      console.error('Error fetching employee data:', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLeaveData();
    }, [])
  );

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const getLeaveStatusColor = (status) => {
    switch (status) {
      case 'Approve':
        return 'green';
      case 'Rejected':
        return 'red';
      case 'Pending':
        return 'orange';
      default:
        return 'black';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.leaveBox, { height: expanded ? '85%' : '60%' }]}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchLeaveData} />
          }
        >
          {leaves.map((leave, index) => (
            <TouchableOpacity key={index} style={styles.leaveItem}>
              <View style={styles.leaveInfo}>
                <Text style={styles.leaveDate}>
                  {leave.FromDate ? leave.FromDate.split('T')[0] : ''}
                </Text>
                <Text style={styles.leaveReason}>{leave.Reason}</Text>
                <Text style={styles.leaveReason}>{leave.LeaveType}</Text>
              </View>
              <Text
                style={[
                  styles.leaveStatus,
                  { color: getLeaveStatusColor(leave.ApproveStatus) },
                ]}
              >
                {leave.ApproveStatus}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity onPress={handleExpand} style={styles.button}>
          <Text style={styles.buttonText}>
            {expanded ? 'See Less' : 'See More'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('NewLeave');
        }}
        style={[
          styles.button,
          {
            marginTop: 20,
            borderRadius: 10,
            shadowColor: 'black',
            shadowOffset: {
              width: 1,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
        ]}
      >
        <Text style={styles.buttonText}>Request New Leave</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#e9e6eb',
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aa18ea',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  leaveBox: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leaveItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: 'lightgray',
    paddingHorizontal: 20,
  },
  leaveInfo: {
    flex: 1,
  },
  leaveDate: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  leaveReason: {
    color: textcolor,
  },
  leaveStatus: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  header: {
    fontWeight: 'bold',
    flex: 1,
    marginTop: 8,
    textAlign: 'center',
    color: 'black',
  },
  cell: {
    flex: 1,
    color: 'gray',
    textAlign: 'center',
  },
});

export default Leave;
