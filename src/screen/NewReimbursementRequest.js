
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, FlatList, TextInput, ScrollView, LogBox, Alert } from 'react-native';
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
    const [selectedFile, setSelectedFile] = useState(null);
    const [employeeDetails,setEmployeeDetails]=useState('');
    const [Token,setToken]=useState('');
     const [EmployeeId, setEmployeeId] = useState('');
   
    useEffect(() => {
     const checkLoginStatus = async () => {
       try {
         const details = await AsyncStorage.getItem("employeeDetails");
         const token = await AsyncStorage.getItem('access_token');
   
         if (details !== null) {
           const parsedDetails = JSON.parse(details);
           
           setEmployeeDetails(parsedDetails);
           setEmployeeId(parsedDetails.EmployeeId);
           setToken(token);

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
      
        // For multiple files
        setSelectedFile(files); // assuming you have `const [selectedFiles, setSelectedFiles] = useState([]);`
      
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
    // Function to render the list of expenses
      
        const formData = [
          { name: 'EmployeeId', data: EmployeeId.toString() }, // ✅ text field
        //   { name: 'Latitude', data: latitude.toString() },     // ✅ text field
        //   { name: 'Longitude', data: longitude.toString() }, 
        //   {name:'MapUrl',data:`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`} , // ✅ text field
        //   {
        //     name: 'Attachment',
        //     filename: selectedFile.name,
        //     type: selectedFile.type,
        //     data: RNFetchBlob.wrap(cleanImagePath),
        //   },
        ];
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
                <Text style={styles.txt}>Journey Description</Text>
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
                <TouchableOpacity style={[styles.button, { marginBottom: 20 }]}>
                    <Text style={styles.buttonText}>Submit Reimbursement Request</Text>
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
