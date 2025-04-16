import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomSwitch from '../component/CustomSwitch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {textcolor} from '../constants/color';
import ResponseModal from '../component/Model';
import Loading from '../component/Loading';

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
  
    // Log all values to verify
    console.log('Leave Type ID:', leaveTypeId);
    console.log('From Date:', FromDate);
    console.log('To Date:', ToDate);
    console.log('Leave For:', LeaveFor);
    console.log('Leave In:', LeaveIn);
    console.log('Reason:', reason);
  
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
});

export default NewLeave;
