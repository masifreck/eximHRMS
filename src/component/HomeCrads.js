import { View, Text, Image, StyleSheet,Dimensions } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
const deviceWidth = Dimensions.get('window').width;
const HomeCrads = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Card
          image={require('../assets/atthhome.png')}
          label="Attendance History"
          NavigationValue='AttnHistory'
        />
        <Card
          image={require('../assets/profile2home.webp')}
          label="My Profile"
          NavigationValue='EProfile'
        />
      </View>
      <View style={styles.row}>
        <Card
          image={require('../assets/leavehome.webp')}
          label="Leave"
           NavigationValue='Leave'
        />
         <Card
          image={require('../assets/newleavehome.png')}
          label="Apply Leave"
          NavigationValue='NewLeave'
          
        />
        
      </View>
      <View style={styles.row}>
        <Card
          image={require('../assets/reimbursementhome.png')}
          label="Reimbursement"
           NavigationValue='Reimbursement'
        />
         <Card
          image={require('../assets/newreimbursementhome.png')}
          label="Apply Reimbursement"
           NavigationValue='NewReimbursementRequest'
        />
        
      </View>
      <View style={styles.row}>
        <Card
          image={require('../assets/holidayhome2.png')}
          label="My Holidays"
           NavigationValue='holidays'
        />
         <Card
          image={require('../assets/salaryhome.png')}
          label="Salary Slip"
 NavigationValue='Salaryslip'
        />
        
      </View>
    </View>
  )
}
import { useNavigation } from '@react-navigation/native';
const Card = ({ image, label, NavigationValue }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (NavigationValue) {
          navigation.navigate(NavigationValue);
        }
      }}
    >
      <Image source={image} style={styles.image} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );}


const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#e8d7f5',
    width:deviceWidth
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,

  },
  card: {
    
    //width: '48%',
    backgroundColor:'white',
    padding: 10,
    borderRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  label: {
    color: '#3e0961',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 8,
    width: deviceWidth*0.4,
    height:60
  },
})

export default HomeCrads
