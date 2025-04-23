import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../component/Loading';
import { useFocusEffect } from '@react-navigation/native';

const Reimbursement = ({ navigation }) => {
    const [employeeDetails, setEmployeeDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const checkLoginStatus = async () => {
                try {
                    setIsLoading(true);
                    const details = await AsyncStorage.getItem("employeeDetails");
                    const token = await AsyncStorage.getItem('access_token');

                    if (details !== null) {
                        const parsedDetails = JSON.parse(details);
                        setEmployeeDetails(parsedDetails);

                        const url = `https://hrexim.tranzol.com/api/Employee/GetReimbursement?EmployeeId=${parsedDetails.EmployeeId}`;
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

                        const responseText = await response.text();
                        const data = JSON.parse(responseText);

                        // Flatten the data and ensure unique ReimbursementId
                        const structuredData = data.flatMap(item =>
                            item.Details.map(detail => ({
                                ...item,
                                ...detail,
                                createDate: new Date(item.CreateDate).toLocaleDateString(),
                                pickDate: detail.PickDate ? new Date(detail.PickDate).toLocaleDateString() : null,
                            }))
                        );

                        // Remove duplicates based on ReimbursementId (only show unique items)
                        const uniqueData = [];
                        const seenReimbursementIds = new Set();

                        structuredData.forEach(item => {
                            if (!seenReimbursementIds.has(item.ReimbursementId)) {
                                seenReimbursementIds.add(item.ReimbursementId);
                                uniqueData.push(item);
                            }
                        });

                        setPendingRequests(uniqueData);
                    }
                } catch (error) {
                    console.error('Error fetching employee data:', error.message);
                } finally {
                    setIsLoading(false);
                }
            };

            checkLoginStatus();
        }, [])
    );

    if (isLoading) return <Loading />;

    const renderPendingRequestItem = ({ item }) => {
        let statusColor;
        if (item.Status === 'Approve') {
            statusColor = 'green';
        } else if (item.Status === 'Pending') {
            statusColor = 'orange';
        } else if (item.Status === 'Reject' || item.Status === 'Rejected') {
            statusColor = 'red';
        }

        return (
            <TouchableOpacity style={styles.requestItem} onPress={() => { navigation.navigate('ReimbursementSts', { data: item }) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={styles.requestTextContainer}>
                        <View style={styles.amountContainer}>
                            <View style={[styles.orangeDot]} />
                            <Text style={[styles.requestText, { color: statusColor }]}>
                                {item.Status}
                            </Text>
                        </View>
                        <View style={styles.amountContainer}>
                            <Text style={styles.rupeesIcon}>₹</Text>
                            <Text style={styles.amount}>{item.ClaimAmount}</Text>
                        </View>
                    </View>
                    <View style={styles.requestTextContainer}>
                        <View style={styles.dateContainer}>
                            <FontAwesome5 name="calendar-alt" size={16} color="gray" />
                            <Text style={styles.dateText}>{item.createDate}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={styles.descriptionText} numberOfLines={1}>
                        {item.JourneyDescription ? item.JourneyDescription : 'No description available'}
                    </Text>
                    <View style={styles.approvedContainer}>
          <View style={styles.amountContainer}>
            <Text style={styles.approvedTitle}>Approved Amount: </Text>
            <Text style={styles.rupeesIcon}>₹</Text>
            <Text style={styles.amount}>{item.ApproveAmount}</Text>
          </View>
        </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
      <View style={styles.container}>
          <ImageBackground source={require('../assets/money.jpg')}>
              <View style={styles.topContainer}>
                  <View style={styles.infoContainer}>
                    
                      <View style={styles.toprequestItem}>
                          <View style={styles.requestTextContainer}>
                         
                          </View>
                      </View>
                  </View>
              </View>

              <TouchableOpacity onPress={() => { navigation.navigate('NewReimbursementRequest')}} style={[styles.button, {
                  borderRadius: 10,
                  shadowColor: 'black',
                  shadowOffset: {
                      width: 1,
                      height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
              }]}>
                  <Text style={styles.buttonText}>Request New Reimbursement</Text>
              </TouchableOpacity>

          </ImageBackground>



          <View style={styles.bottomContainer}>

              <View style={styles.tabsContainer}>
             
              </View>
              {/* FlatList */}
              <FlatList
                  data={pendingRequests}
                  keyExtractor={(item) => item.ReimbursementId}
                  renderItem={ renderPendingRequestItem }
                  contentContainerStyle={styles.flatListContent}
              />
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topContainer: {
        margin: 16,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'stretch',
        overflow: "hidden",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        backgroundColor: '#fff',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    iconContainer: {
        marginRight: 8,
        // Add styles for the icon container
    },
    textContainer: {
        flexDirection: 'column',
        // flex: 1,
    },
    expensesTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#736f71',
    },
    expensesAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rupeesIcon: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 10
    },
    expensesAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    requestsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    toprequestItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    orangeDot: {
        backgroundColor: 'orange',
    },
    greenDot: {
        backgroundColor: 'green',
    },
    requestTextContainer: {
        flexDirection: 'column',
    },
    requestText: {
        fontSize: 12,
        color: '#736f71',
        marginRight: 8,
        fontWeight: '600'
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    bottomContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tabsContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#ccc',
        borderBottomColor: '#ccc',
        // paddingVertical: 8,
        backgroundColor: '#f7f0fa',
        shadowColor: 'black',
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#aa18ea',
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#736f71',
    },
    button: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#aa18ea',
        marginHorizontal: 16,
        marginBottom: 20
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white',
    },
    requestItem: {
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    detailsContainer: {
        marginTop: 4,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    dateText: {
        marginLeft: 6,
        color: 'gray',
    },
    descriptionText: {
        fontSize: 14,
        color: 'black',
    },
    approvedContainer: {
        marginTop: 8,
    },
    claimedContainer: {
        marginTop: 8,
    },
    approvedTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: 'black',
    },
    claimedTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: 'black',
    },
});

export default Reimbursement;
