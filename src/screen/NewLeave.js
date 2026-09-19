import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,ActivityIndicator
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomSwitch from '../component/CustomSwitch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {textcolor} from '../constants/color';
import ResponseModal from '../component/Model';
import Loading from '../component/Loading';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const NewLeave = ({navigation}) => {
  const [FromDate, setFromDate] = useState('Start Date');
  const [ToDate, setToDate] = useState('End Date');
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [reason, setReason] = useState('');
  const [emName, setEmName] = useState('');
  const [emNumber, setEmNumber] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [LeaveFor, setLeaveFor] = useState(1);
  const [LeaveIn, setLeaveIn] = useState(1);
const [leaveBalance, setLeaveBalance] = useState(null);
const [balanceLoading, setBalanceLoading] = useState(true);

  const handleSwitchLeaveFor = value => {
    setLeaveFor(value);
    console.log('leavefor value',value)
  };

  const handleSwitchLeaveIn = value => {
    setLeaveIn(value); // Update state based on the selected mode
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleModalClose = () => {
    setIsModalVisible(false);
    setModalMessage('');
  };
  const getLeaveBalance = async () => {
  try {
    setBalanceLoading(true);

    const token = await AsyncStorage.getItem('access_token');
    const details = await AsyncStorage.getItem('employeeDetails');

    if (!details) {
      throw new Error('Employee details not found');
    }

    const employeeDetails = JSON.parse(details);
    const employeeId = employeeDetails.EmployeeId;

    if (!employeeId) {
      throw new Error('Employee ID not found');
    }

    const response = await fetch(
      `https://hrexim.tranzol.com/api/Leave/GetLeaveBalance?employeeId=${employeeId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const contentType = response.headers.get('content-type');

    let responseData;

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    console.log('Leave Balance Response:', responseData);

    if (!response.ok) {
      throw new Error('Failed to fetch leave balance');
    }

    const result = responseData?.data?.Result;

    if (!result) {
      throw new Error(
        responseData?.data?.ErrorMsg || 'Leave balance not found'
      );
    }

    setLeaveBalance(result);
  } catch (error) {
    console.error('Error fetching leave balance:', error);

    setLeaveBalance(null);

    Alert.alert(
      'Error',
      'Unable to load your leave balance. Please try again.'
    );
  } finally {
    setBalanceLoading(false);
  }
};
useEffect(() => {
  getLeaveBalance();
}, []);
  useEffect(() => {
    const DropDown = async () => {
      try {
        // Retrieve mobile number and token from AsyncStorage
        const mobileNo = await AsyncStorage.getItem('mobileNo');
        setEmNumber(mobileNo);
        const token = await AsyncStorage.getItem('access_token');
        const details = await AsyncStorage.getItem('employeeDetails');
        if (details !== null) {
          const parsedDetails = JSON.parse(details);
          setEmName(parsedDetails.FirstName);
          setPosition(parsedDetails.Designation);
          setDepartment(parsedDetails.Department);
          setEmployeeCode(parsedDetails.EmployeeCode);
        }

        // Call the API with the mobile number and bearer token
        const url = `https://hrexim.tranzol.com/api/Leave/GetLeaveType`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // navigation.replace('newlogin');
          throw new Error('Invalid response from server');
        }

        const LeaveType = await response.json();
//console.log('dropdowndata',LeaveType)
setData(
  LeaveType.data.map(item => ({
    id: item.Id,
    label: item.LeaveType,
  }))
);


      } catch (error) {
        console.error('Error fetching employee data:', error.message);
        // Navigate to login on error
        //navigation.replace('newlogin');
      }
    };
    DropDown();
  }, [navigation]);

  const [leaveType, setLeaveType] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

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
const calculateLeaveDays = () => {
  if (!FromDate || !ToDate) {
    return 0;
  }

  const from = new Date(FromDate);
  const to = new Date(ToDate);

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return 0;
  }

  const difference =
    Math.floor(
      (to.setHours(0, 0, 0, 0) -
        from.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    );

  return difference + 1;
};
  const handleEndDateConfirm = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
  
    const formattedDate = `${year}-${month}-${day}`; // Combine in YYYY-MM-DD format
    setToDate(formattedDate);
    hideEndDatePicker();
  };
  const validateInputs = () => {
    if (!leaveTypeId) {
      setModalMessage('Choose Leave Type');
      setIsModalVisible(true);
      return false;
    }
    if (FromDate === 'Start Date') {
      setModalMessage('Enter From Date');
      setIsModalVisible(true);
      return false;
    }
    
    if (ToDate === 'End Date') {
      setModalMessage('Enter To Date');
      setIsModalVisible(true);
      return false;
    }
    
    if (!LeaveFor) {
      setModalMessage('Choose Leave For (Full day or Half day)');
      setIsModalVisible(true);
      return false;
    }
    if (!LeaveIn) {
      setModalMessage('Choose Leave In (Full day or Half day)');
      setIsModalVisible(true);
      return false;
    }
    if (!reason.trim()) {
      setModalMessage('Enter a reason for the leave');
      setIsModalVisible(true);
      return false;
    }
    return true;
  };
  const handleSubmit = async () => {
    if (!validateInputs()) return;
    if (balanceLoading) {
    Alert.alert(
      'Please wait',
      'Leave balance is still loading.'
    );
    return;
  }

  if (!leaveBalance) {
    Alert.alert(
      'Leave Balance',
      'Unable to verify your leave balance. Please refresh and try again.'
    );
    return;
  }

  const requestedDays = calculateLeaveDays();

  if (requestedDays <= 0) {
    Alert.alert(
      'Invalid Date',
      'Please select a valid leave date.'
    );
    return;
  }

  const balanceKey = leaveBalanceMap[leaveTypeId];

  if (!balanceKey) {
    Alert.alert(
      'Leave Type',
      'Unable to determine the selected leave type.'
    );
    return;
  }

  const availableBalance = Number(
    leaveBalance[balanceKey] || 0
  );

  console.log('Selected Leave Type:', leaveTypeId);
  console.log('Balance Key:', balanceKey);
  console.log('Available Balance:', availableBalance);
  console.log('Requested Days:', requestedDays);

  // LossofPay does not require available leave balance
  if (balanceKey !== 'LossofPay') {
    const usableBalance = Math.max(0, availableBalance);

    if (usableBalance < requestedDays) {
      Alert.alert(
        'Insufficient Leave Balance',
        `You have ${usableBalance} day(s) of ${balanceKey} remaining, but you are trying to apply for ${requestedDays} day(s).`
      );

      return;
    }
  }
    setLoading(true);
  
    try {
      const token = await AsyncStorage.getItem('access_token');
      const details = await AsyncStorage.getItem('employeeDetails');
      const employeeDetails = JSON.parse(details);
    
      const payload = {
        EmployeeId: employeeDetails.EmployeeId,
        FromDate: FromDate,
        ToDate: ToDate,
        LeaveTypeId: leaveTypeId,
        LeaveFor: LeaveFor,
        LeaveIn: LeaveIn,
        Reason: reason,
        LeaveStatus: 2
      };
    
      console.log('Payload:', payload);
    
      const response = await fetch('https://hrexim.tranzol.com/api/Leave/Create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    
      const contentType = response.headers.get('content-type');
      let responseData;
    
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
    
      console.log('Response:', responseData);
    
      if (response.ok) {
        setModalMessage('Leave successfully submitted!');
        Alert.alert('Success', 'Leave successfully submitted!');
        setIsModalVisible(true);
        navigation.navigate('DrawerNavigation');
      } else {
        setModalMessage('Failed to submit leave. Please try again.');
        setIsModalVisible(true);
      
      }
    } catch (error) {
      console.error('Error submitting leave:', error);
      setModalMessage('An error occurred. Please try again.');
      setIsModalVisible(true);
    } finally {
      setLoading(false);
    }
  }    
  
  

  return (
    <>
    {loading ? (
   <Loading/>
    ) : (
      <>

    <ScrollView>
<View style={styles.leaveBalanceSection}>

  <View style={styles.balanceTopRow}>
    <View>
      <Text style={styles.balanceHeading}>Leave Balance</Text>
      <Text style={styles.balanceSubHeading}>
        Available leave credits
      </Text>
    </View>

    <TouchableOpacity
      style={styles.refreshButton}
      onPress={getLeaveBalance}
      disabled={balanceLoading}
    >
      <MaterialCommunityIcons
        name="refresh"
        size={18}
        color="#2563EB"
      />
    </TouchableOpacity>
  </View>

  {balanceLoading ? (
    <View style={styles.balanceLoader}>
      <ActivityIndicator size="small" color="#2563EB" />
      <Text style={styles.balanceLoaderText}>
        Updating balance...
      </Text>
    </View>
  ) : leaveBalance ? (

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.balanceScroll}
    >

      {/* Casual */}
      <View style={styles.balanceMiniCard}>
        <View style={styles.balanceIconWrapper}>
          <MaterialCommunityIcons
            name="calendar-account"
            size={18}
            color="#2563EB"
          />
        </View>

        <View>
          <Text style={styles.balanceMiniLabel}>
            Casual
          </Text>

          <Text style={styles.balanceMiniValue}>
            {Math.max(
              0,
              Number(leaveBalance.CasualLeave || 0)
            )}
          </Text>
        </View>
      </View>

      {/* Earned */}
      <View style={styles.balanceMiniCard}>
        <View style={styles.balanceIconWrapper}>
          <MaterialCommunityIcons
            name="calendar-check"
            size={18}
            color="#059669"
          />
        </View>

        <View>
          <Text style={styles.balanceMiniLabel}>
            Earned
          </Text>

          <Text style={styles.balanceMiniValue}>
            {Math.max(
              0,
              Number(leaveBalance.EarnedLeave || 0)
            )}
          </Text>
        </View>
      </View>

      {/* Sick */}
      <View style={styles.balanceMiniCard}>
        <View style={styles.balanceIconWrapper}>
          <MaterialCommunityIcons
            name="medical-bag"
            size={18}
            color="#DC2626"
          />
        </View>

        <View>
          <Text style={styles.balanceMiniLabel}>
            Sick
          </Text>

          <Text style={styles.balanceMiniValue}>
            {Math.max(
              0,
              Number(leaveBalance.SickLeave || 0)
            )}
          </Text>
        </View>
      </View>

      {/* Maternity */}
      <View style={styles.balanceMiniCard}>
        <View style={styles.balanceIconWrapper}>
          <MaterialCommunityIcons
            name="human-pregnant"
            size={18}
            color="#9333EA"
          />
        </View>

        <View>
          <Text style={styles.balanceMiniLabel}>
            Maternity
          </Text>

          <Text style={styles.balanceMiniValue}>
            {Math.max(
              0,
              Number(leaveBalance.MaternityLeave || 0)
            )}
          </Text>
        </View>
      </View>

      {/* Paternity */}
      <View style={styles.balanceMiniCard}>
        <View style={styles.balanceIconWrapper}>
          <MaterialCommunityIcons
            name="account-child"
            size={18}
            color="#0891B2"
          />
        </View>

        <View>
          <Text style={styles.balanceMiniLabel}>
            Paternity
          </Text>

          <Text style={styles.balanceMiniValue}>
            {Math.max(
              0,
              Number(leaveBalance.PaternityLeave || 0)
            )}
          </Text>
        </View>
      </View>

      {/* Marriage */}
      <View style={styles.balanceMiniCard}>
        <View style={styles.balanceIconWrapper}>
          <MaterialCommunityIcons
            name="heart-outline"
            size={18}
            color="#E11D48"
          />
        </View>

        <View>
          <Text style={styles.balanceMiniLabel}>
            Marriage
          </Text>

          <Text style={styles.balanceMiniValue}>
            {Math.max(
              0,
              Number(leaveBalance.MarriageLeave || 0)
            )}
          </Text>
        </View>
      </View>

      {/* Compensatory */}
      <View style={styles.balanceMiniCard}>
        <View style={styles.balanceIconWrapper}>
          <MaterialCommunityIcons
            name="swap-horizontal"
            size={18}
            color="#D97706"
          />
        </View>

        <View>
          <Text style={styles.balanceMiniLabel}>
            Comp Off
          </Text>

          <Text style={styles.balanceMiniValue}>
            {Math.max(
              0,
              Number(leaveBalance.CompensatoryLeave || 0)
            )}
          </Text>
        </View>
      </View>

      {/* On Duty */}
      <View style={styles.balanceMiniCard}>
        <View style={styles.balanceIconWrapper}>
          <MaterialCommunityIcons
            name="briefcase-check-outline"
            size={18}
            color="#4F46E5"
          />
        </View>

        <View>
          <Text style={styles.balanceMiniLabel}>
            On Duty
          </Text>

          <Text style={styles.balanceMiniValue}>
            {Math.max(
              0,
              Number(leaveBalance.OnDuty || 0)
            )}
          </Text>
        </View>
      </View>

    </ScrollView>

  ) : (
    <View style={styles.balanceError}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={18}
        color="#DC2626"
      />

      <Text style={styles.balanceErrorText}>
        Unable to load leave balance
      </Text>
    </View>
  )}

</View>
      <View style={styles.container}>
      <Dropdown
  style={styles.dropdown}
  placeholderStyle={styles.placeholderStyle}
  selectedTextStyle={styles.selectedTextStyle}
  itemTextStyle={{ color: 'black' }}
  data={data} // Data set correctly
  maxHeight={500}
  labelField="label" // Matches the mapped key
  valueField="id" // Matches the mapped key
  placeholder={!isFocus ? 'Select Leave Type' : '...'}
  searchPlaceholder="Search..."
  value={leaveTypeId} // Bind selected value
  onFocus={() => setIsFocus(true)}
  onBlur={() => setIsFocus(false)}
  onChange={item => {
    setLeaveType(item.label); // Optional: Update the label state
    setLeaveTypeId(item.id); // Correctly set leaveTypeId
    console.log('Selected LeaveTypeId:', item.id); // Log for debugging
    setIsFocus(false);
  }}
/>



        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <TouchableOpacity style={styles.date} onPress={showStartDatePicker}>
            <AntDesign name="calendar" size={22} color={'gray'} />
            <Text style={styles.buttonText}>{FromDate}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.date} onPress={showEndDatePicker}>
            <AntDesign name="calendar" size={22} color={'gray'} />
            <Text style={styles.buttonText}>{ToDate}</Text>
          </TouchableOpacity>
        </View>

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

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View style={{width: '48%'}}>
            <Text style={styles.txt}>Start Day</Text>
            <CustomSwitch
              selectionMode={1}
              option1="Full Day"
              option2="Half Day"
              onSelectSwitch={handleSwitchLeaveFor}
              width={'100%'}
            />
          </View>
          <View style={{width: '48%'}}>
            <Text style={styles.txt}>End Day</Text>
            <CustomSwitch
              selectionMode={1}
              option1="Full Day"
              option2="Half Day"
              onSelectSwitch={handleSwitchLeaveIn}
              width={'100%'}
            />
          </View>
        </View>

        <TextInput
          style={[styles.input, {marginTop: 20, height: 80}]}
          value={reason}
          onChangeText={text => setReason(text)}
          placeholder="Enter reason"
          placeholderTextColor={'gray'}
          multiline
        />
        <View style={{marginTop: 10}}>
          <Text style={styles.txt}> Contact Details</Text>
          <TextInput
            style={styles.input}
            value={emName}
            editable={false}
            onChangeText={text => setEmName(text)}
            placeholder="Enter Name"
            placeholderTextColor={'gray'}
          />
          <TextInput
            style={[styles.input, {marginTop: 10}]}
            value={employeeCode}
            placeholderTextColor={'gray'}
            editable={false}
          />
          <TextInput
            style={[styles.input, {marginTop: 10}]}
            value={emNumber}
            onChangeText={text => setEmNumber(text)}
            placeholder="Enter Mobile Number"
            placeholderTextColor={'gray'}
            keyboardType="numeric"
            editable={false}
          />
          <TextInput
            style={[styles.input, {marginTop: 10}]}
            value={department}
            placeholderTextColor={textcolor}
            editable={false}
          />
          <TextInput
            style={[styles.input, {marginTop: 10}]}
            value={position}
            placeholderTextColor={'gray'}
            editable={false}
          />
        </View>

        <TouchableOpacity style={styles.button}>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
              paddingLeft: 10,
            }}
            onPress={handleSubmit}>
            Submit Request
          </Text>
        </TouchableOpacity>
      </View>
      <ResponseModal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        responseText={modalMessage}
      />
    </ScrollView>

    </>)}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e9e6eb',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    // height:100,
    fontSize: 16,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // marginTop: 20,
    color:textcolor
  },
  dropdown: {
    height: 50,
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 10,
    alignSelf: 'center',
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
  placeholderStyle: {
    fontSize: 15,
    color: '#6c6f73',
  },
  selectedTextStyle: {
    fontSize: 15,
    color: 'black',
  },

  date: {
    height: 50,
    width: '48%',
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
  buttonText: {
    fontWeight: 'bold',
    color: 'gray',
    paddingLeft: 10,
  },
  txt: {
    marginBottom: 5,
    color: 'gray',
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 12,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aa18ea',
    marginTop: 20,
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
 leaveBalanceSection: {
  backgroundColor: '#FFFFFF',
  borderRadius: 14,
  paddingVertical: 14,
  paddingLeft: 15,
  marginBottom: 16,

  borderWidth: 1,
  borderColor: '#E8ECF2',

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.04,
  shadowRadius: 6,

  elevation: 2,
},

balanceTopRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingRight: 15,
  marginBottom: 12,
},

balanceHeading: {
  fontSize: 16,
  fontWeight: '700',
  color: '#111827',
},

balanceSubHeading: {
  marginTop: 2,
  fontSize: 11,
  color: '#8A94A6',
},

refreshButton: {
  width: 34,
  height: 34,
  borderRadius: 10,

  backgroundColor: '#EFF6FF',

  alignItems: 'center',
  justifyContent: 'center',
},

balanceScroll: {
  paddingRight: 15,
},

balanceMiniCard: {
  minWidth: 112,
  height: 62,

  flexDirection: 'row',
  alignItems: 'center',

  backgroundColor: '#F9FAFB',

  borderRadius: 11,

  borderWidth: 1,
  borderColor: '#EEF0F4',

  paddingHorizontal: 10,

  marginRight: 9,
},

balanceIconWrapper: {
  width: 34,
  height: 34,
  borderRadius: 9,

  backgroundColor: '#FFFFFF',

  alignItems: 'center',
  justifyContent: 'center',

  marginRight: 9,
},

balanceMiniLabel: {
  fontSize: 10,
  color: '#8A94A6',
  marginBottom: 2,
},

balanceMiniValue: {
  fontSize: 17,
  fontWeight: '700',
  color: '#172033',
},

balanceLoader: {
  height: 62,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},

balanceLoaderText: {
  marginLeft: 8,
  fontSize: 12,
  color: '#7B8494',
},

balanceError: {
  height: 50,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
},

balanceErrorText: {
  marginLeft: 7,
  fontSize: 12,
  color: '#DC2626',
},
});

export default NewLeave;
