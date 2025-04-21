import React ,{useState}from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity ,Alert,ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ReimbursementSts = ({route,navigation}) => {
  const [isCancelling, setIsCancelling] = useState(false);

  // Function to render the list of expenses
  const { data } = route.params || {};
  //console.log('data',data)
  let statusColor = 'black';

  if (data?.Status === 'Approve') {
    statusColor = 'green';
  } else if (data?.Status === 'Pending') {
    statusColor = 'yellow';
  } else if (data?.Status === 'Reject' || data?.Status === 'Rejected') {
    statusColor = 'red';
  }
  
  const cancelRequest = async (id, ReimbursementId, navigation) => {
    setIsCancelling(true); // Start loading
    try {
      const token = await AsyncStorage.getItem('access_token');
      console.log('Cancel Params:', { id, ReimbursementId }); // Log input values

      const body = JSON.stringify({
        Id: id,
        ReimbursementId: ReimbursementId,
      });
      
     // console.log('Request body:', body); // 👈 This logs the request body
      
      const response = await fetch('https://hrexim.tranzol.com/api/Employee/CancelReimbursementRequest', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: body,
      });
      
  
      const result = await response.json();
      //console.log('Cancel response:', result);
  
      if (response.ok && result.status === 'Success') {
        Alert.alert('Success', result.message, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        throw new Error(result.message || 'Failed to cancel the request');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'Something went wrong while cancelling the request');
    } finally {
      setIsCancelling(false); // Stop loading
    }
  };
  
  
  const RenderExpenseList = () => {
    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{fontSize:18, color: 'green',fontWeight:'bold'}}>₹ {data.approvedAmount}</Text>
          <Text style={{ fontSize: 14, color: 'gray' }}>{data.createDate}</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}>
          <Text style={styles.item}>{data.fromPlace}</Text>
          <Text style={{ fontSize: 14, color: 'gray', fontWeight: 'bold' }}>- -</Text>
          <Text style={styles.item}>{data.toPlace}</Text>
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
            color: 'blue',
            fontSize: 14,
            fontWeight: 'bold'
          }}>{data.travelTypeName}</Text></Text>
          <Text style={{ fontSize: 13, color: 'gray', fontWeight: '500' }}>Kilometers : <Text style={{
            color: 'blue',
            fontSize: 14,
            fontWeight: 'bold'
          }}>{data.kilometers}</Text></Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontSize: 12, color: 'gray', fontWeight: '500' }}>Fare : <Text style={{
            color: 'green',
            fontSize: 13,
            fontWeight: '600'
          }}> ₹ {data.Amount}</Text></Text>
          <Text style={{ fontSize: 12, color: 'gray', fontWeight: '500' }}>Fooding : <Text style={{
            color: 'green',
            fontSize: 13,
            fontWeight: '600'
          }}> ₹ {data.fooding}</Text></Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 12, color: 'gray', fontWeight: '500' }}>Lodging : <Text style={{
            color: 'green',
            fontSize: 13,
            fontWeight: '600'
          }}> ₹ {data.lodging}</Text></Text>
          <Text style={{ fontSize: 12, color: 'gray', fontWeight: '500' }}>Misc. Expense : <Text style={{
            color: 'green',
            fontSize: 13,
            fontWeight: '600'
          }}> ₹ 1000</Text></Text>
        </View>
        <Text style={[styles.label,{marginTop:8}]}>Claim Ammount : <Text style={[styles.item
        ,{color:'green'}]}> ₹ {data.claimAmount}</Text></Text>
      </View>
    );
  };

  return (
    <ScrollView>
       
      <View style={styles.container}>
     
        <View style={styles.boxContainer}>
        <RenderExpenseList/>
          <View style={{
            borderBottomWidth: 0.8,
            borderBottomColor: 'lightgray',
            marginTop: 10
          }}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.item}>
             {data.remarks}
            </Text>
          </View>
          <View style={[styles.rowContainer, { marginTop: 20 }]}>
            <View style={styles.circleContainer}>
              <Image
                source={require('../assets/mypic.jpeg')}
                style={styles.circleImage}
              />
            </View>
            <View style={styles.columnContainer}>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#736f71'
              }}>{data.ActionHead}</Text>
              <Text style={{
                fontWeight: '600',
                color: 'gray'
              }}></Text>
            </View>
            <View style={styles.statusContainer}>
              <Text style={[styles.approved,]}>{data.Status}</Text>
              <Text style={styles.timestamp}>Pick Date: {data.pickDate}</Text>
            </View>

          </View>
          
          <View style={[styles.rowContainer, { paddingBottom: 10, borderBottomColor: 'lightgray', borderBottomWidth: 0.8 }]}>
            <Text style={{
              color: '#e68837',
              fontWeight: '600'
            }}>Warning:</Text>
            <Text style={{
              color: '#736f71',
              fontWeight: '400',
              marginLeft: 10
            }}></Text>
          </View>
          {(data.Status === 'Pending' || data.Status === 'Submit') && (
  <TouchableOpacity
    style={styles.button}
    onPress={() => cancelRequest(data.id, data.ReimbursementId, navigation)}
    disabled={isCancelling} // Disable button during loading
  >
    {isCancelling ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={styles.buttonText}>Cancel Request</Text>
    )}
  </TouchableOpacity>
)}


        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#e9e6eb',
  },
  boxContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 16
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  columnContainer: {
    flexDirection: 'column',
    marginRight: 10,
  },
  label: {
    fontWeight: '700',
    color: 'gray'
  },
  item: {
    fontSize: 16,
    color: 'black',
    // color: '#736f71',
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8
  },
  circleContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderColor: 'gray',
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  circleImage: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
  },
  statusContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  approved: {
    color: 'green',
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: 'gray'
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
    

  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ReimbursementSts;
