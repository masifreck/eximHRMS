
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, FlatList, TextInput, ScrollView, LogBox, Alert, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DocumentPicker from 'react-native-document-picker';
import Uploading from '../component/Uploading';
import CustomFilePicker from '../component/CustomFilePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
LogBox.ignoreAllLogs();
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
const deviceWidth = Dimensions.get('window').width;

const NewReimbursementRequest = ({ navigation }) => {
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [description, setDescription] = useState('');
    const [claimAmmount, setClaimAmmount] = useState(0.00);
    const fileListHeight = selectedDocuments.length * 60;
    const [isVisible, setIsVisible] = useState(false);

    const [expenseData, setExpenseData] = useState([]);
    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [employeeDetails,setEmployeeDetails]=useState('');
    const [Token,setToken]=useState('');
     const [EmployeeId, setEmployeeId] = useState('');
     const [postLoading,setPostLoading]=useState(false);
   const [userId,setuserId]=useState('');
    useEffect(() => {
     const checkLoginStatus = async () => {
       try {
         const details = await AsyncStorage.getItem("employeeDetails");
         const token = await AsyncStorage.getItem('access_token');
   const user=await AsyncStorage.getItem('userId');
         if (details !== null) {
           const parsedDetails = JSON.parse(details);
           
           setEmployeeDetails(parsedDetails);
           setEmployeeId(parsedDetails.EmployeeId);
           setToken(token);
           setuserId(user);

         }
        } catch (error) {
            console.error('Error fetching employee data:', error.message);
          } finally {
            setLoading(false);
          }
        };
      
        checkLoginStatus();
      }, []);

     
      const handleFileSelected = (files) => {
        console.log('Selected files:', files);
      
        setSelectedFiles(files);
      
        files.forEach((file, index) => {
          console.log(`File ${index + 1}:`);
          console.log('Name:', file.name);
          console.log('Type:', file.type);
          console.log('URI:', file.uri);
        });
      };
      
      

    // Function to handle navigation to NewExpense screen
    const handleAddExpense = () => {
        navigation.navigate('NewExpense', { onSave: handleSaveExpense ,data });
       
    };
    useEffect(() => {
        if (expenseData.length > 0) {
          console.log('Updated expense data:', expenseData);
        }
      }, [expenseData]);
      

    // Function to handle saving the expense from NewExpense screen
    const handleSaveExpense = (expenseDetails) => {
        setExpenseData((prevExpenseData) => [...prevExpenseData, expenseDetails]);
        // Update total expense amount
        console.log('data of expense',expenseData)
        setClaimAmmount((prevTotalExpense) => prevTotalExpense + expenseDetails.total);
        setIsVisible(true);
    };
    // Function to remove an expense
    const handleRemoveExpense = (index) => {
        setExpenseData((prevExpenseData) => {
            const updatedExpenseData = [...prevExpenseData];
            const removedExpense = updatedExpenseData.splice(index, 1)[0];
            setClaimAmmount((prevClaimAmount) => prevClaimAmount - removedExpense.total);
            return updatedExpenseData;
        });
    };
    function formatDate(dateStr) {
        // Check if date is valid
        if (!dateStr) return '';
        console.log('received date',dateStr)
        // Example: 18/04/2025 => 2025-04-18
        const [day, month, year] = dateStr.split('/');
        if (!day || !month || !year) return ''; // Invalid date format
        
        return `${year}-${month}-${day}`; // Convert to yyyy-mm-dd
      }
      
    // Function to render the list of expenses
    const PostExpense = async () => {
        try {
         // console.log("Expense Data:", expenseData); // Debugging
      
          // Validate the expenseData
          if (!expenseData || !expenseData[0]?.selectedDate) {
            Alert.alert('Missing Data', 'Please fill in the expense details.');
            return;
          }
      
          // Validate description
          if (!description || description.trim() === '') {
            Alert.alert('Missing Description', 'Please provide a journey description.');
            return;
          }
      
          // Validate attachments
          if (!selectedFiles || selectedFiles.length === 0) {
            Alert.alert('Missing Attachment', 'Please select at least one attachment.');
            return;
          }
      
          const token = await AsyncStorage.getItem('access_token');
          setPostLoading(true);
      
          // Handle date formatting correctly
          const formattedPickDate = formatDate(expenseData[0]?.selectedDate);
      
          if (!formattedPickDate) {
            Alert.alert('Invalid Date', 'Please provide a valid date.');
            return;
          }
      
          // Prepare form data
          const formData = [
            { name: 'EmployeeId', data: EmployeeId?.toString() ?? '' },
            { name: 'PickDate', data: formattedPickDate },
            { name: 'JobNo', data: expenseData[0]?.jobNumber?.toString() ?? '' },
            { name: 'FromPlace', data: expenseData[0]?.fromPlace?.toString() ?? '' },
            { name: 'ToPlace', data: expenseData[0]?.toPlace?.toString() ?? '' },
            { name: 'TravelTypeId', data: expenseData[0]?.travelType?.toString() ?? '' },
            { name: 'Kilometers', data: expenseData[0]?.kilometers?.toString() ?? '' },
            { name: 'Amount', data: expenseData[0]?.fare?.toString() ?? '' },
            { name: 'Fooding', data: expenseData[0]?.fooding?.toString() ?? '' },
            { name: 'Lodging', data: expenseData[0]?.lodging?.toString() ?? '' },
            { name: 'Expense', data: expenseData[0]?.misc?.toString() ?? '' },
            { name: 'Remarks', data: expenseData[0]?.remark?.toString() ?? '' },
            { name: 'JourneyDescription', data: description?.toString() ?? '' },
            {name :'ActionBy',data:userId.toString()},
          ];
      
          // Attach selected files
          selectedFiles.forEach((file, index) => {
            formData.push({
              name: `Attachment${index + 1}`,
              filename: file.name,
              type: file.type,
              data: RNFetchBlob.wrap(file.uri.replace('file://', '')),
            });
          });
      
          console.log('Sending formData:', formData);
      
          // Send the formData to the API
          const response = await RNFetchBlob.fetch('POST', 'https://hrexim.tranzol.com/api/Employee/AddReimbursement', {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }, formData);
      
          // Log the response for debugging
          const result = await response.text();  // Use .text() instead of .json() since it's a plain string
          console.log('Server response:', result);
      
          // Check the response type
          if (typeof result === 'string' && result.includes('Added Successfully')) {
            Alert.alert('Success', 'Reimbursement added successfully.');
            navigation.goBack();
          } else {
            Alert.alert('Failed', 'Submission failed. Please try again.');
          }
      
        } catch (err) {
          console.error('Error in PostExpense:', err);
          Alert.alert('Error', 'Something went wrong while submitting the expense.');
        } finally {
          setPostLoading(false);
        }
      };
      
    
      
      
      // Helper function for formatting the date correctly
  
      
      
      
      
    const renderExpenseList = () => {
        return expenseData.map((expense, index) => (
            <View key={index} style={styles.expenseContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.amount}>₹ {expense.total}</Text>
                    <Text style={{ fontSize: 14, color: 'gray' }}>{expense.selectedDate}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                }}>
                    <Text style={{ fontSize: 14, color: 'black', fontWeight: '600' }}>{expense.fromPlace === '' ? 'None' : expense.fromPlace}</Text>
                    <Text style={{ fontSize: 14, color: 'gray', fontWeight: 'bold' }}>- -</Text>
                    <Text style={{ fontSize: 14, color: 'black', fontWeight: '600' }}>{expense.toPlace === '' ? 'None' : expense.toPlace}</Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                    borderBottomColor: 'lightgray',
                    borderBottomWidth: 0.8,
                    paddingBottom: 6,
                    marginBottom: 6,
                    marginTop: 2
                }}>
                    <Text style={{ fontSize: 13, color: 'gray', fontWeight: '500' }}>Travel Type : <Text style={{
                        color: 'green',
                        fontSize: 14,
                        fontWeight: 'bold'
                    }}>{expense.travelType}</Text></Text>
                    <Text style={{ fontSize: 13, color: 'gray', fontWeight: '500' }}>Kilometers : <Text style={{
                        color: 'blue',
                        fontSize: 14,
                        fontWeight: 'bold'
                    }}>{expense.kilometers}</Text></Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 12, color: 'gray', fontWeight: '500' }}>Fare : <Text style={{
                        color: 'green',
                        fontSize: 13,
                        fontWeight: '600'
                    }}> ₹ {expense.fare}</Text></Text>
                    <Text style={{ fontSize: 12, color: 'gray', fontWeight: '500' }}>Fooding : <Text style={{
                        color: 'green',
                        fontSize: 13,
                        fontWeight: '600'
                    }}> ₹ {expense.fooding}</Text></Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: 'gray', fontWeight: '500' }}>Lodging : <Text style={{
                        color: 'green',
                        fontSize: 13,
                        fontWeight: '600'
                    }}> ₹ {expense.lodging}</Text></Text>
                    <Text style={{ fontSize: 12, color: 'gray', fontWeight: '500' }}>Misc. Expense : <Text style={{
                        color: 'green',
                        fontSize: 13,
                        fontWeight: '600'
                    }}> ₹ {expense.misc}</Text></Text>
                </View>
                <Text style={{ fontSize: 14, color: 'black', fontWeight: '500', marginTop: 8 }}>{expense.remark == '' ? 'No Remark given by Employee' : expense.remark}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View></View>
                    <TouchableOpacity onPress={() => handleRemoveExpense(index)}>
                        <Text style={{ color: 'red', fontWeight: '700' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        ));
    };





    useEffect(() => {
        // Simulating file upload progress
        const interval = setInterval(() => {
            setSelectedDocuments((prevDocuments) => {
                const updatedDocuments = prevDocuments.map((document) => ({
                    ...document,
                    progress: document.progress + 0.1, // Increase progress by 0.1
                }));

                return updatedDocuments;
            });
        }, 200);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const [data, setData] = useState([]);

    useEffect(() => {
        const getTravelType = async () => {
          try {
            const token = await AsyncStorage.getItem('access_token');
            const url = 'https://hrexim.tranzol.com/api/Employee/GettravelType';
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
      
            if (!response.ok) {
              Alert.alert('Error', 'Response is not ok in travel type dropdown');
              return;
            }
      
            const travelTypeData = await response.json();
           // console.log('travel type drop down', travelTypeData);
      
            const formattedData = travelTypeData?.map(item => ({
              label: item.TravelType, // for dropdown display
              value: item.Id,          // actual value
            })) || [];
      
            setData(formattedData);
          } catch (error) {
            Alert.alert('Error', error.message || 'Something went wrong');
          }
        };
      
        getTravelType();
      }, []);
      
    


    return (
        <ScrollView style={styles.container}>
            <View style={[styles.rowContainer, { marginHorizontal: 20, marginTop: 16 }]}>
                <View style={styles.columnContainer}>
                    <Text style={styles.claimAmmount}>Claim Amount</Text>
                    <Text style={styles.amount}>₹ {claimAmmount}</Text>
                </View>
               
            </View>

           

            <View style={{ marginTop: 10, marginHorizontal: 20 }}>
                <Text style={styles.txt}>Journey Description<Text style={{color:'red'
                }}>*</Text></Text>
                <TextInput
                    style={[styles.input]}
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    placeholder="Enter Journey description"
                    placeholderTextColor={'gray'}
                    multiline
                />
            </View>
            <CustomFilePicker onFileSelected={handleFileSelected} />
            {isVisible && expenseData.length > 0 ?(null): ( <TouchableOpacity style={[styles.button, { marginTop: 20 }]}
                onPress={handleAddExpense} >
                <Text style={styles.buttonText}>
                    Add New Expense
                </Text>
            </TouchableOpacity>)}
            <View style={styles.expenseList}>{renderExpenseList()}</View>
            {isVisible && expenseData.length > 0 ? (
                <TouchableOpacity style={[styles.button, { marginBottom: 20 }]} onPress={PostExpense} disabled={postLoading}>
                  {postLoading ? (
  <ActivityIndicator size="small" color="#fff" />
) : (
  <Text style={styles.buttonText}>Submit Reimbursement Request</Text>
)}

                </TouchableOpacity>
            ) : null}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 20,
        backgroundColor: '#e9e6eb',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        backgroundColor: '#fff',
    },
    columnContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 20,
    },
    attachment: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '25%',
    },
    label: {
        fontSize: 12,
        color: 'gray',
    },
    claimAmmount: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
        color: 'black',
    },
    amount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
    },
    fileIcon: {
        marginBottom: 10,
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
        borderColor: 'lightgray',
        borderWidth: 0.8,
        overflow: 'hidden'
    },
    rightIcon: {
        height: 23,
        width: 23,
    },
    fileInfoContainer: {
        alignItems: "flex-start",
        justifyContent: 'center'
    },
    fileName: {
        fontSize: 12,
        color: 'black',
        marginBottom: 4
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
        // marginHorizontal: 20,

    },
    txt: {
        marginBottom: 5,
        color: 'gray',
        fontWeight: '700',
        marginLeft: 6,
        fontSize: 12
    },
    fileListContainer: {
        marginTop: 10,
        overflow: 'hidden',
        marginHorizontal: 20,
    },
    button: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#aa18ea',
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: 20
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white',
    },
    expenseContainer: {
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
        marginHorizontal: 20,
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    expenseList: {
        marginTop: 16
    }
});

export default NewReimbursementRequest;
