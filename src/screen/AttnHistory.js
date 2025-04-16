import React, { useState ,useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,ActivityIndicator
} from 'react-native';


import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { textcolor } from '../constants/color';
// import AttSummary from '../component/AttnSummary';

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
  const [punchData, setPunchData] = useState({
    '2023-06-01': { punchIn: '09:30 AM', punchOut: '05:00 PM' },
    '2023-06-02': { punchIn: '08:45 AM', punchOut: '05:15 PM' },
    // Add more punch data for other dates
  });
 const [FromDate, setFromDate] = useState('Start Date');
  const [ToDate, setToDate] = useState('End Date');
   const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
    const [loading, setLoading] = useState(false); // state to track loading
    const [attendanceData, setAttendanceData] = useState([]);
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  



  
  //   return (
  //     <View style={{
  //       backgroundColor: 'white',
  //       marginTop: 20,
  //       marginHorizontal: 10,
  //       padding: 10,
  //       borderRadius: 10,
  //       shadowColor: 'black',
  //       shadowOffset: {
  //         width: 1,
  //         height: 2,
  //       },
  //       shadowOpacity: 0.25,
  //       shadowRadius: 3.84,
  //       elevation: 5,
  //     }}>
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           justifyContent: 'space-between',
  //           marginBottom: 10,
  //         }}>
  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             alignItems: 'center',
  //             // width: 120,
  //             marginLeft: 20,
  //           }}>
  //           {renderDot('green')}
  //           <Text style={{ color: 'gray' }}>Perfect Time: 47%</Text>
  //         </View>
  //         <View
  //           style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
  //           {renderDot('orange')}
  //           <Text style={{ color: 'gray' }}>Half Day: 16%</Text>
  //         </View>
  //       </View>
  //       <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             alignItems: 'center',
  //             // width: 120,
  //             marginLeft: 20,
  //           }}>
  //           {renderDot('red')}

  //           <Text style={{ color: 'gray' }}>lateComing: 23%</Text>

  //         </View>
  //         <View
  //           style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
  //           {renderDot('#3BE9DE')}
  //           <Text style={{ color: 'gray' }}>Leave: 40%</Text>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // };

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
      // Retrieve mobile number and token from AsyncStorage
      const mobileNo = await AsyncStorage.getItem('mobileNo');
      const token = await AsyncStorage.getItem('access_token');

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
        navigation.replace('newlogin');
        throw new Error('Invalid response from server');
      }

      const AttendanceLatest = await response.json();
      setAttendanceData(AttendanceLatest.data.Result); // Store fetched data
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error('Error fetching employee data:', error.message);
      navigation.replace('newlogin');
    }
  };
  return (
    <ScrollView >
      {/* <SafeAreaView style={styles.container}> */}
    

      <View style={styles.summaryContainer}>
        <View style={styles.daillySummary}>
          <Text style={{
            fontWeight: 'bold',
            textAlign: 'center',
            paddingVertical: 8,
            fontSize: 16,
            color: 'white',
            backgroundColor: '#3e0961',
          }}>Latest Attendance Report</Text>
            <View style={styles.timeContainer}>
              <Text style={{ color: 'black', fontSize: 14, textAlign: 'center', fontWeight: '600' }}>Punch In Time</Text>
              <Text style={{ color: textcolor, fontSize: 13, textAlign: 'center', fontWeight: '700', marginTop: 6 }}>
                {Details.LogInTime+' '}
                {Details.LogInDate?Details.LogInDate.split('T')[0]:''}</Text>
              <Text style={{ color: 'black', fontSize: 14, textAlign: 'center', fontWeight: '600', marginTop: 6 }}>Punch Out Time</Text>
              <Text style={{ color: textcolor, fontSize: 13, textAlign: 'center', fontWeight: '700', marginTop: 6 }}> {Details.LogOutTime+' '}
              {Details.LogOutDate?Details.LogOutDate.split('T')[0]:''}</Text>
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
        <Text style={{color:'white',fontSize:11,fontWeight:'bold'}}>GET DETAILS</Text>
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
        <ScrollView>
          {attendanceData.map((attendance, index) => (
            <View key={index} style={{ marginBottom: 20, padding: 10, backgroundColor: 'white', borderRadius: 8,paddingHorizontal:20,elevation:4 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white',backgroundColor:'#3e0961',borderRadius:10,
              textAlign:'center',padding:3
            }}>
              {attendance.ProcessDate.split('T')[0]}
            </Text>
          
            {/* Log In Time */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 }}>
              <Text style={styles.attntext}>Log In Time:</Text>
              <Text style={styles.attntext}>{attendance.LogInTime}</Text>
            </View>
          
            {/* Log Out Time */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 }}>
              <Text style={styles.attntext}>Log Out Time:</Text>
              <Text style={styles.attntext}>{attendance.LogOutTime}</Text>
            </View>
          
            {/* Log In Date */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 }}>
              <Text style={styles.attntext}>Log In Date:</Text>
              <Text style={styles.attntext}>{attendance.LogInDate.split('T')[0]}</Text>
            </View>
          
            {/* Log Out Date */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 }}>
              <Text style={styles.attntext}>Log Out Date:</Text>
              <Text style={styles.attntext}>{attendance.LogOutDate.split('T')[0]}</Text>
            </View>
          </View>
          
          ))}
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
    width: '100%',
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
    overflow: 'hidden'
  },
  weeklySummary: {
    width: '58%',
    height: 200,
    // backgroundColor : 'green'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default AttnHistory;
