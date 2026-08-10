import React, { useState ,useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,ActivityIndicator,
  Alert,Dimensions,Modal} from 'react-native';

import AttendancePieChart from '../component/AttendancePieChart';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColor, textcolor } from '../constants/color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import AttSummary from '../component/AttnSummary';
const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3;
function AttnHistory({navigation}) {
  const [Details,setData]=useState([])
  
  const [selectedLogInTime, setSelectedLogInTime] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
const [selectedAttendance, setSelectedAttendance] = useState(null);
const [currentMonth, setCurrentMonth] = useState(new Date());
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Retrieve mobile number and token from AsyncStorage
        const mobileNo = await AsyncStorage.getItem('mobileNo');
        const token = await AsyncStorage.getItem('access_token');
        const details = await AsyncStorage.getItem("employeeDetails");
        const parsedDetails = JSON.parse(details);
        // If token or mobile number is missing, navigate to login
        if (!mobileNo || !token) {
          navigation.replace('newlogin');
          return;
        }

        // Call the API with the mobile number and bearer token
        const url = `https://hrexim.tranzol.com/api/Employee/GetAttendancePerDay?employeeId=${parsedDetails.EmployeeId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          //navigation.replace('newlogin');
          throw new Error(`Invalid response from server. Status code: ${response.status}`);
        }

        const AttendanceLatest = await response.json();
        
         setData(AttendanceLatest);
         //console.log('latest attn', AttendanceLatest)
      } catch (error) {
        console.error('Error fetching employee data:', error.message);
        // Navigate to login on error
        //navigation.replace('newlogin');
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

  useEffect(()=>{
    if (FromDate === 'Start Date' || ToDate === 'End Date') {
      return;
    }
    GetSelectedAttendance();
  },[FromDate,ToDate])

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
      const details = await AsyncStorage.getItem("employeeDetails");
      const parsedDetails = JSON.parse(details);
      
      // If token or mobile number is missing, navigate to login
      if (!mobileNo || !token) {
        navigation.replace('newlogin');
        return;
      }

      // Call the API with the mobile number and bearer token
      const url = `https://hrexim.tranzol.com/api/Employee/GetAttendanceAnalysis?employeeId=${parsedDetails.EmployeeId}&startDate=${FromDate}&endDate=${ToDate}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        //navigation.replace('newlogin');
        throw new Error(`Invalid response from server. Status code: ${response.status}`);
      }

      const AttendanceLatest = await response.json();
      setAttendanceData(AttendanceLatest); // Store fetched data
   //   console.log('month wise attendance',AttendanceLatest)
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error('Error fetching employee data:', error.message);
      //navigation.replace('newlogin');
    }finally{
      setLoading(false);
    }
  };
  const leaveTypeMap = {
    CL: { label: 'Casual Leave', icon: 'umbrella-beach',iconcolor:'' },
    SL: { label: 'Sick Leave', icon: 'hospital' },
    EL: { label: 'Earned Leave', icon: 'calendar-check' },
    ML: { label: 'Maternity Leave', icon: 'baby-face-outline' },
    PAT: { label: 'Paternity Leave', icon: 'baby-carriage' },
    MAL: { label: 'Marriage Leave', icon: 'ring' },
    COL: { label: 'Compensatory Leave', icon: 'calendar-clock' },
    LOP: { label: 'Loss of Pay', icon: 'currency-usd-off' },
    OD: { label: 'On Duty', icon: 'briefcase-account' },
    WO: { label: 'Weekly Off', icon: 'calendar-weekend' },
    SPL: { label: 'Special Leave', icon: 'star-circle' },
    HF: { label: 'Half Day', icon: 'weather-sunset',iconcolor:'#ffd700'  },         // 🌇 half day
    NH: { label: 'National Holiday', icon: 'flag-variant' ,},   // 🏳️ national holiday
    AB: { label: 'Absent', icon: 'account-off' ,iconcolor:'red' },
    FD: {label :'Full Day',icon :'briefcase-account',iconcolor:'green'}              // 🙅 absent
  };
   const testCode = Details?.Test;
  
  const leaveInfo = leaveTypeMap[testCode] || { label: testCode || '--', icon: 'information-outline' };
  const parseDate = dateValue => {
  if (!dateValue) return null;

  if (dateValue instanceof Date) {
    return new Date(
      dateValue.getFullYear(),
      dateValue.getMonth(),
      dateValue.getDate()
    );
  }

  const value = String(dateValue);

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);

    return new Date(year, month - 1, day);
  }

  // DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split('-').map(Number);

    return new Date(year, month - 1, day);
  }

  // DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split('/').map(Number);

    return new Date(year, month - 1, day);
  }

  return new Date(value);
};


const getDateKey = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getAttendanceDateKey = attendance => {
  return attendance?.ShiftDate?.split('T')[0];
};

const getAttendanceType = attendance => {
  if (!attendance) {
    return 'EMPTY';
  }

  const shiftName = attendance.ShiftName?.toUpperCase();
  const test = attendance.Test?.toUpperCase();

  const totalMinutes = Number(attendance.TotalMinute || 0);

  // Week Off
  if (shiftName === 'WO' || test === 'WO') {
    return 'WO';
  }

  // Holiday
  if (shiftName === 'NH' || test === 'NH') {
    return 'HOLIDAY';
  }

  // Half Day explicitly returned by API
  if (
    shiftName === 'HD' ||
    test === 'HD' ||
    shiftName === 'HALF DAY' ||
    test === 'HALF DAY'
  ) {
    return 'HALF_DAY';
  }

  // Half Day based on working minutes
  if (
    shiftName === 'GN' &&
    attendance.LogInTime &&
    attendance.LogOutTime &&
    totalMinutes > 0 &&
    totalMinutes < 240
  ) {
    return 'HALF_DAY';
  }

  // Absent
  if (
    shiftName === 'GN' &&
    !attendance.LogInTime &&
    !attendance.LogOutTime
  ) {
    return 'ABSENT';
  }

  // Present
  if (
    shiftName === 'GN' &&
    attendance.LogInTime
  ) {
    return 'PRESENT';
  }

  return 'EMPTY';
};
const createCalendar = () => {
  const startDate = parseDate(FromDate);
  const endDate = parseDate(ToDate);

  if (!startDate || !endDate) {
    return [];
  }

  const attendanceMap = {};

  attendanceData?.forEach(item => {
    const dateKey = getAttendanceDateKey(item);

    if (dateKey) {
      attendanceMap[dateKey] = item;
    }
  });

  const calendar = [];

  const current = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1
  );

  const lastMonth = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    1
  );

  while (current <= lastMonth) {

    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDay = new Date(
      year,
      month,
      1
    ).getDay();

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {

      const date = new Date(
        year,
        month,
        day
      );

      // Don't show dates outside selected range
      if (
        date < startDate ||
        date > endDate
      ) {
        days.push(null);
        continue;
      }

      const dateKey = getDateKey(date);

      days.push({
        day,
        dateKey,
        attendance: attendanceMap[dateKey] || null,
      });
    }

    calendar.push({
      year,
      month,
      days,
    });

    current.setMonth(
      current.getMonth() + 1
    );
  }

  return calendar;
};

const calendarMonths = createCalendar();
    
  return (
    <ScrollView >
      {/* <SafeAreaView style={styles.container}> */}
    

      <View style={styles.daillySummary}>
        <View style={{backgroundColor:darkColor,paddingHorizontal:10,paddingVertical:5,borderRadius:10}}>
        <Text style={[styles.headerText,{textAlign:'center'}]}>
          <Icon name="clipboard-text-clock-outline" size={18} color="white" /> Latest Attendance Report
        </Text>
        </View>
        <View style={styles.timeContainer}>
          <View style={styles.row}>
            <Icon name="calendar" size={18} color="blue" style={styles.icon} />
            <Text style={styles.timeText}>Date: {Details.ProcessDate ? Details.ProcessDate.split('T')[0] : ''}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="login" size={18} color="green" style={styles.icon} />
            <Text style={styles.timeText}>Punch In Time: {Details.LogInTime || '--'}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="logout" size={18} color="red" style={styles.icon} />
            <Text style={styles.timeText}>Punch Out Time: {Details.LogOutTime || '--'}</Text>
          </View>
          <View style={[styles.row,]}>
  <Icon name={leaveInfo.icon} size={18} color={leaveInfo.iconcolor ||"#3e0961"} style={styles.icon} />
  <Text style={styles.timeText}>Status: {leaveInfo.label}</Text>
</View>

        </View>
      </View>
   <View style={styles.dateSelectionCard}>

  {/* FROM DATE */}
  <TouchableOpacity
    style={styles.dateBox}
    onPress={showStartDatePicker}
    activeOpacity={0.8}
  >
    <View style={styles.dateIconContainer}>
      <Icon
        name="calendar-start"
        size={22}
        color="#3e0961"
      />
    </View>

    <View style={styles.dateTextContainer}>
      <Text style={styles.dateLabel}>
        FROM DATE
      </Text>

      <Text style={styles.dateValue}>
        {FromDate}
      </Text>
    </View>
  </TouchableOpacity>


  {/* ARROW */}
  <View style={styles.dateArrowContainer}>
    <Icon
      name="arrow-right"
      size={20}
      color="#3e0961"
    />
  </View>


  {/* TO DATE */}
  <TouchableOpacity
    style={styles.dateBox}
    onPress={showEndDatePicker}
    activeOpacity={0.8}
  >
    <View style={styles.dateIconContainer}>
      <Icon
        name="calendar-end"
        size={22}
        color="#3e0961"
      />
    </View>

    <View style={styles.dateTextContainer}>
      <Text style={styles.dateLabel}>
        TO DATE
      </Text>

      <Text style={styles.dateValue}>
        {ToDate}
      </Text>
    </View>
  </TouchableOpacity>


  {/* DATE PICKERS */}
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
<AttendancePieChart attendanceData={attendanceData} />
     <View style={{ flex: 1, padding: 16 }}>
      {/* Loading indicator */}
      {loading ? (
        <ActivityIndicator size="large" color={darkColor} />
      ) : (
        // ScrollView to display the attendance data
        <ScrollView horizontal>
        <View style={{flex:1,width:width*0.9}}>
          {/* Table Header */}
     
  
  
          {/* Table Rows */}
<View style={styles.calendarContainer}>

  {calendarMonths.map((monthData, monthIndex) => {

    const monthName = new Date(
      monthData.year,
      monthData.month,
      1
    ).toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    return (
      <View
        key={`${monthData.year}-${monthData.month}`}
        style={styles.monthContainer}
      >

        {/* ================= MONTH TITLE ================= */}

        <View style={styles.monthHeader}>

          <Text style={styles.monthTitle}>
            {monthName}
          </Text>

        </View>


        {/* ================= LEGEND ================= */}

        {monthIndex === 0 && (
          <View style={styles.legendContainer}>

            {/* Present */}

            <View style={styles.legendItem}>

              <View
                style={[
                  styles.legendColor,
                  {
                    backgroundColor: '#D9F2DC',
                  },
                ]}
              />

              <Text style={styles.legendText}>
                Present
              </Text>

            </View>


            {/* Week Off */}

            <View style={styles.legendItem}>

              <View
                style={[
                  styles.legendColor,
                  {
                    backgroundColor: '#FFE0C2',
                  },
                ]}
              />

              <Text style={styles.legendText}>
                Week Off
              </Text>

            </View>


            {/* Holiday */}

            <View style={styles.legendItem}>

              <View
                style={[
                  styles.legendColor,
                  {
                    backgroundColor: '#CDE7F7',
                  },
                ]}
              />

              <Text style={styles.legendText}>
                Holiday
              </Text>

            </View>


            {/* Half Day */}

            <View style={styles.legendItem}>

              <View
                style={[
                  styles.legendColor,
                  {
                    backgroundColor: '#FFF0B3',
                  },
                ]}
              />

              <Text style={styles.legendText}>
                Half Day
              </Text>

            </View>


            {/* Absent */}

            <View style={styles.legendItem}>

              <View
                style={[
                  styles.legendColor,
                  {
                    backgroundColor: '#FFD6D6',
                  },
                ]}
              />

              <Text style={styles.legendText}>
                Absent
              </Text>

            </View>

          </View>
        )}


        {/* ================= WEEK HEADER ================= */}

        <View style={styles.weekHeader}>

          {[
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
          ].map(day => (

            <View
              key={day}
              style={styles.weekDay}
            >

              <Text style={styles.weekDayText}>
                {day}
              </Text>

            </View>

          ))}

        </View>


        {/* ================= CALENDAR GRID ================= */}

        <View style={styles.calendarGrid}>

          {monthData.days.map((item, index) => {

            // Empty cell
            if (!item) {
              return (
                <View
                  key={`empty-${index}`}
                  style={styles.calendarCell}
                />
              );
            }

            const attendance =
              item.attendance;

            const type =
              getAttendanceType(attendance);


            // Default
            let backgroundColor = '#FFFFFF';
            let borderColor = '#E5E5E5';
            let statusColor = '#777777';
            let statusText = '';


            // PRESENT
            if (type === 'PRESENT') {

              backgroundColor = '#E8F7EA';
              borderColor = '#B7E0BD';
              statusColor = '#23963A';
              statusText = 'Present';

            }


            // WEEK OFF
            else if (type === 'WO') {

              backgroundColor = '#FFE7D2';
              borderColor = '#F5C39C';
              statusColor = '#C96B20';
              statusText = 'Week Off';

            }


            // HOLIDAY
            else if (type === 'HOLIDAY') {

              backgroundColor = '#DCEFFA';
              borderColor = '#A9D3EA';
              statusColor = '#2176A5';
              statusText = 'Holiday';

            }


            // HALF DAY
            else if (type === 'HALF_DAY') {

              backgroundColor = '#FFF3C4';
              borderColor = '#E8D77B';
              statusColor = '#9B7A00';
              statusText = 'Half Day';

            }


            // ABSENT
            else if (type === 'ABSENT') {

              backgroundColor = '#FFE0E0';
              borderColor = '#F2B5B5';
              statusColor = '#D32F2F';
              statusText = 'Absent';

            }


            return (
              <TouchableOpacity
                key={item.dateKey}
                activeOpacity={
                  attendance ? 0.7 : 1
                }
                onPress={() => {

                  if (!attendance) {
                    return;
                  }

                  setSelectedAttendance(
                    attendance
                  );

                  setModalVisible(true);

                }}
                style={[
                  styles.calendarCell,
                  {
                    backgroundColor,
                    borderColor,
                  },
                ]}
              >

                {/* DATE */}

                <Text
                  style={styles.calendarDate}
                >
                  {item.day}
                </Text>


                {/* STATUS */}

                {statusText !== '' && (
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          statusColor,
                      },
                    ]}
                  >

                    <Text
                      style={styles.statusText}
                    >
                      {statusText}
                    </Text>

                  </View>
                )}


                {/* LOGIN */}
{attendance?.ShiftName && (
                  <Text
                    style={styles.calendarInfo}
                  >
                     {attendance.ShiftName}, {attendance.Test}
                  </Text>
                ) }
                {attendance?.LogInTime && (
                  <Text
                    style={styles.calendarInfo}
                  >
                    ↪ {attendance.LogInTime}
                  </Text>
                )}


                {/* LOGOUT */}

                {attendance?.LogOutTime && (
                  <Text
                    style={styles.calendarInfo}
                  >
                    ↩ {attendance.LogOutTime}
                  </Text>
                )}


                {/* TOTAL HOURS */}

                {Number(
                  attendance?.TotalMinute || 0
                ) > 0 && (

                  <Text
                    style={styles.calendarInfo}
                  >
                    ◷{' '}
                    {Math.floor(
                      Number(
                        attendance.TotalMinute
                      ) / 60
                    )}
                    h{' '}
                    {Number(
                      attendance.TotalMinute
                    ) % 60}
                    m
                  </Text>

                )}

              </TouchableOpacity>
            );
          })}

        </View>

      </View>
    );
  })}

</View>
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

  tableCell: {
    width: '30%',
  },

  attntext: {
    color: textcolor,
    fontWeight: 'bold',
  },

  calendarContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
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
    flexDirection: 'row',
  },

  summaryContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },

  daillySummary: {
    marginTop: 10,
    width: '97%',
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
    overflow: 'hidden',
    margin: 10,
    padding: 16,
    paddingBottom: 20,
  },

  weeklySummary: {
    width: '58%',
    height: 200,
  },

  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  timeContainer: {
    marginTop: 16,
    gap: 10,
  },

  row: {
    flexDirection: 'row',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
    width: COLUMN_WIDTH,
  },

  cell: {
    flex: 1,
    paddingHorizontal: 5,
    color: textcolor,
    width: COLUMN_WIDTH,
    fontWeight: 'bold',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    position: 'relative',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '92%',
    alignSelf: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 10,
  },

  closeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },

  modalDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 10,
  },

  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  label: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },

  value: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '600',
    maxWidth: '55%',
    textAlign: 'right',
  },

  closeButton: {
    marginTop: 18,
    backgroundColor: '#333333',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },

  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  monthHeader: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
  },

  monthArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },

  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FAFAFA',
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginVertical: 4,
  },

  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 5,
  },

  legendText: {
    fontSize: 11,
    color: '#555555',
  },

  weekHeader: {
    flexDirection: 'row',
    backgroundColor: '#F7F8FA',
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },

  weekDay: {
    width: '14.2857%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#EEEEEE',
  },

  weekDayText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555555',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  calendarCell: {
    width: '14.2857%',
    minHeight: 105,
    padding: 5,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'flex-start',
  },

  calendarDate: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },

  statusBadge: {
    alignSelf: 'stretch',
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 2,
    marginBottom: 4,
  },

  statusText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
    textAlign: 'center',
  },

  calendarInfo: {
    fontSize: 8,
    color: '#4D5965',
    marginTop: 2,
  },

  dateSelectionCard: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E8E0ED',
  },

  dateBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F2FA',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E6D8ED',
  },

  dateIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },

  dateTextContainer: {
    flex: 1,
  },

  dateLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#7A6B82',
    marginBottom: 3,
  },

  dateValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3e0961',
  },

  dateArrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EDE3F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
});

export default AttnHistory;
