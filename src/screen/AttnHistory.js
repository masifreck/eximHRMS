import React, { useState ,useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,ActivityIndicator,
  Alert,Dimensions} from 'react-native';


import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { textcolor } from '../constants/color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import AttSummary from '../component/AttnSummary';
const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3;
function AttnHistory({navigation}) {
  const [Details,setData]=useState([])
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
        const url = `https://hrexim.tranzol.com/api/Attendance/AttendanceLatest?mobileno=${mobileNo}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          //navigation.replace('newlogin');
          throw new Error('Invalid response from server');
        }

        const AttendanceLatest = await response.json();
        const dat=AttendanceLatest.data.Result
         setData(dat);
        console.log(Details)
      } catch (error) {
        console.error('Error fetching employee data:', error.message);
        // Navigate to login on error
        navigation.replace('newlogin');
      }
    };
    checkLoginStatus()
  }, [navigation]);
  const [selectedDate, setSelectedDate] = useState(null);

 const [FromDate, setFromDate] = useState('Start Date');
  const [ToDate, setToDate] = useState('End Date');
   const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
    const [loading, setLoading] = useState(false); // state to track loading
    const [attendanceData, setAttendanceData] = useState([]);
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const showStartDatePicker = () => {
    setStartDatePickerVisible(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisible(false);
  };

  const handleStartDateConfirm = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
  
    const formattedDate = `${year}-${month}-${day}`; // Combine in YYYY-MM-DD format
    setFromDate(formattedDate);
    hideStartDatePicker();
  };
  
  

  const showEndDatePicker = () => {
    setEndDatePickerVisible(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisible(false);
  };

  const handleEndDateConfirm = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
  
    const formattedDate = `${year}-${month}-${day}`; // Combine in YYYY-MM-DD format
    setToDate(formattedDate);
    hideEndDatePicker();
  }

  const GetSelectedAttendance = async () => {
    try {
      setLoading(true);
      // Retrieve mobile number and token from AsyncStorage
      const mobileNo = await AsyncStorage.getItem('mobileNo');
      const token = await AsyncStorage.getItem('access_token');
      if (FromDate === 'Start Date' || ToDate === 'End Date') {
        Alert.alert('Invalid Input', 'Please choose a valid date range.');
        return;
      }
      // If token or mobile number is missing, navigate to login
      if (!mobileNo || !token) {
        navigation.replace('newlogin');
        return;
      }

      // Call the API with the mobile number and bearer token
      const url = `https://hrexim.tranzol.com/api/Attendance/AttendanceDetails?mobileno=${mobileNo}&fromdate=${FromDate}&todate=${ToDate}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        //navigation.replace('newlogin');
        throw new Error('Invalid response from server');
      }

      const AttendanceLatest = await response.json();
      setAttendanceData(AttendanceLatest.data.Result); // Store fetched data
      //console.log('month wise attendance',AttendanceLatest.data.Result)
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error('Error fetching employee data:', error.message);
      //navigation.replace('newlogin');
    }finally{
      setLoading(false);
    }
  };
  return (
    <ScrollView >
      {/* <SafeAreaView style={styles.container}> */}
    

      <View style={styles.daillySummary}>
        <Text style={styles.headerText}>
          <Icon name="clipboard-text-clock-outline" size={18} color="white" /> Latest Attendance Report
        </Text>
        <View style={styles.timeContainer}>
          <View style={styles.row}>
            <Icon name="calendar" size={18} color="#3e0961" style={styles.icon} />
            <Text style={styles.timeText}>Date: {Details.LogInDate ? Details.LogInDate.split('T')[0] : ''}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="login" size={18} color="#3e0961" style={styles.icon} />
            <Text style={styles.timeText}>Punch In Time: {Details.LogInTime || '--'}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="logout" size={18} color="#3e0961" style={styles.icon} />
            <Text style={styles.timeText}>Punch Out Time: {Details.LogOutTime || '--'}</Text>
          </View>
        </View>
      </View>
      <View style={{backgroundColor:'#3e0961',padding:10,margin:10,elevation:4,borderRadius:10,flexDirection:'row',justifyContent:'space-between'}}>
  <TouchableOpacity style={styles.date} onPress={showStartDatePicker}>
            <AntDesign name="calendar" size={22} color={textcolor} />
            <Text style={{color:textcolor,fontSize:11,fontWeight:'bold'}}>{FromDate}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.date} onPress={showEndDatePicker}>
            <AntDesign name="calendar" size={22} color={textcolor} />
            <Text style={{color:textcolor,fontSize:11,fontWeight:'bold'}}>{ToDate}</Text>
          </TouchableOpacity>
       <TouchableOpacity style={{backgroundColor:'#aa18ea',borderRadius:10,elevation:4,width:'25%',justifyContent:'center',alignItems:'center'}}
       onPress={GetSelectedAttendance}
       >
         {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Text style={{color:'white',fontSize:11,fontWeight:'bold'}}>GET DETAILS</Text>)}
       </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="date"
          onConfirm={handleStartDateConfirm}
          onCancel={hideStartDatePicker}
        />

        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="date"
          onConfirm={handleEndDateConfirm}
          onCancel={hideEndDatePicker}
        />
     </View>
     <View style={{ flex: 1, padding: 16 }}>
      {/* Loading indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        // ScrollView to display the attendance data
        <ScrollView horizontal>
        <View style={{flex:1,width:width}}>
          {/* Table Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerCell}>
            <Icon name="calendar" size={18} color="#fff" style={styles.icon} />
              <Text style={styles.headerText}> Date</Text>
            </View>
            <View style={styles.headerCell}>
              <Icon name="login" size={16} color="#fff" />
              <Text style={styles.headerText}> Log In</Text>
            </View>
            <View style={styles.headerCell}>
              <Icon name="logout" size={16} color="#fff" />
              <Text style={styles.headerText}> Log Out</Text>
            </View>
          </View>
  
          {/* Table Rows */}
          {attendanceData.map((attendance, index) => (
            <View
              key={index}
              style={[
                styles.row,
                { backgroundColor: index % 2 === 0 ? '#fff' : '#f5f5f5' },
              ]}
            >
              <Text style={styles.cell}>{attendance.ProcessDate?.split('T')[0]}</Text>
              <Text style={styles.cell}>{attendance.LogInTime}</Text>
              <Text style={styles.cell}>{attendance.LogOutTime? attendance.LogOutTime : '' }</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
      
      )}
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: '#e9e6eb',
  },
  timeContainer: {
    marginTop: 8
  },
  tableCell:{
    width:'30%'
  },
  attntext:{
    color:textcolor,fontWeight:'bold'
  },
  calendarContainer: {
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
    margin: 10,
    borderRadius: 7
  },
  date: {
    height: 50,
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  summaryContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10
  },
  daillySummary: {
    marginTop:10,
    width: '97%',
    height: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',margin:10,
    padding:16
  },
  weeklySummary: {
    width: '58%',
    height: 200,
    // backgroundColor : 'green'
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 17,
    color: 'white',
    backgroundColor: '#3e0961',
    borderRadius: 8,
    overflow: 'hidden',
  },
  timeContainer: {
    marginTop: 16,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
  },
  timeText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#3e0961',
    paddingVertical: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 4,
  },
  headerCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    width:COLUMN_WIDTH,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  
  },
  cell: {
    flex: 1,
    paddingHorizontal: 5,
    color: '#333',  width:COLUMN_WIDTH
  },
});

export default AttnHistory;
