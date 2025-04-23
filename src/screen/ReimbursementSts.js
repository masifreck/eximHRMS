import React ,{useState}from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity ,Alert,ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColor, textcolor } from '../constants/color';


const ReimbursementSts = ({route,navigation}) => {
  const [isCancelling, setIsCancelling] = useState(false);

  // Function to render the list of expenses
  const { data } = route.params || {};
 // console.log('data',data)
  let statusColor = 'black';

  if (data?.Status === 'Approve') {
    statusColor = 'green';
  } else if (data?.Status === 'Pending') {
    statusColor = 'yellow';
  } else if (data?.Status === 'Reject' || data?.Status === 'Rejected') {
    statusColor = 'red';
  }
  
  const cancelRequest = async (id, navigation) => {
    setIsCancelling(true); // Start loading
    try {
      const token = await AsyncStorage.getItem('access_token');
      console.log('Cancel Params:', { id, ReimbursementId: data.ReimbursementId });


      const body = JSON.stringify({
        Id: id,
        ReimbursementId: data.ReimbursementId,
      });
      
      console.log('Request body:', body); // 👈 This logs the request body
      
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
    if (!Array.isArray(data.Details) || data.Details.length === 0) return null;
  
    return data.Details.map((item, index) => (
      <View key={index} style={{ marginBottom: 15, borderBottomWidth: 0.6, borderBottomColor: '#ccc', paddingBottom: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 4 ,color:darkColor,}}>Expense #{index + 1}</Text>
  
        <View style={styles.row}>
          <Text style={styles.labelSmall}>Travel Type:</Text>
          <Text style={styles.value}>{item.TravelTypeName || '-'}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={styles.labelSmall}>From:</Text>
          <Text style={styles.value}>{item.FromPlace}</Text>
          
        </View>
        <View style={styles.row}>
        <Text style={styles.labelSmall}>To:</Text>
        <Text style={styles.value}>{item.ToPlace}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={styles.labelSmall}>Kilometers:</Text>
          <Text style={styles.value}>{item.Kilometers}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={styles.labelSmall}>Fare:</Text>
          <Text style={styles.valueGreen}>₹ {item.Amount}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={styles.labelSmall}>Fooding:</Text>
          <Text style={styles.valueGreen}>₹ {item.Fooding}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={styles.labelSmall}>Lodging:</Text>
          <Text style={styles.valueGreen}>₹ {item.Lodging}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={styles.labelSmall}>Misc. Expense:</Text>
          <Text style={styles.valueGreen}>₹ {item.MiscExpense || 0}</Text>
        </View>
        <View style={styles.row}>
        <Text style={styles.labelSmall}>Remark:</Text>
        <Text style={styles.value}>{item.DetailsReamrk?item.DetailsReamrk :''}</Text>
        </View>
        {/* {(data.Status === 'Pending' || data.Status === 'Submit') && ( */}
  <TouchableOpacity
    style={styles.button}
    onPress={() => cancelRequest(item.Id,  navigation)}
    disabled={isCancelling} // Disable button during loading
  >
    {isCancelling ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={styles.buttonText}>Cancel Request</Text>
    )}
  </TouchableOpacity>
{/* )} */}
      </View>
    ));
  };
  

  return (
    <ScrollView>
       
      <View style={styles.container}>
     
        <View style={styles.boxContainer}>
       
          <View style={{
            borderBottomWidth: 0.8,
            borderBottomColor: 'lightgray',
            marginTop: 10
          }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{fontSize:18, color: 'green',fontWeight:'bold'}}>₹ {data.ApproveAmount}</Text>
          <Text style={{ fontSize: 14, color: 'gray' }}>{data.createDate}</Text>
        </View>
        {/* <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}>
          <Text style={styles.item}>{data.fromPlace}</Text>
          <Text style={{ fontSize: 14, color: 'gray', fontWeight: 'bold' }}>- -</Text>
          <Text style={styles.item}>{data.toPlace}</Text>
        </View> */}
            <Text style={[styles.label,{marginTop:8}]}>Claim Ammount : <Text style={[styles.item
        ,{color:'green'}]}> ₹ {data.ClaimAmount}</Text></Text>
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
          <View style={{flexDirection:'row'}}>
          <Text style={{
              color: '#e68837',
              fontWeight: '600'
            }}>Action By          :</Text>
            <Text style={{
              color: textcolor,
              fontWeight: '400',
              marginLeft: 10
            }}>{data.ActionBy}</Text>
          </View>
          <View style={[styles.rowContainer, { paddingBottom: 10, borderBottomColor: 'lightgray', borderBottomWidth: 0.8 }]}>
        
            <Text style={{
              color: '#e68837',
              fontWeight: '600'
            }}>Action Remark :</Text>
            <Text style={{
              color: textcolor,
              fontWeight: '400',
              marginLeft: 10
            }}>{data.HoldingRemarks}</Text>
          </View>
          

<RenderExpenseList/>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  labelSmall: {
    fontSize: 13,
    fontWeight: '500',
    color: textcolor,
    width:'30%'
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: darkColor,
    width:'70%'
  },
  valueGreen: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
  },
  
});

export default ReimbursementSts;
