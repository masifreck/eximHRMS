import { View, Text, Image, StyleSheet,Dimensions } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
const deviceWidth = Dimensions.get('window').width;
const HomeCrads = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Card
          image={require('../assets/atthhome.png')}
          label="Attendance History"
        />
        <Card
          image={require('../assets/profilehome.jpg')}
          label="My Profile"
        />
      </View>
      <View style={styles.row}>
        <Card
          image={require('../assets/profilehome.jpg')}
          label="Something Else"
        />
        {/* Add more cards here if needed */}
      </View>
    </View>
  )
}

const Card = ({ image, label }) => (
  <TouchableOpacity style={styles.card}>
    <Image source={image} style={styles.image} />
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
)

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
backgroundColor:'red'
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
    width: 100,
    height: 100,
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
