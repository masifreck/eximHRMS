import { View, Text, StyleSheet, ImageBackground, Image, Dimensions, ScrollView, TouchableOpacity ,ActivityIndicator} from 'react-native'
import React, { useState ,useEffect} from 'react'
import Insurance from '../component/Insurance';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const EProfile = () => {
  const [employeeDetails,setEmployeeDetails]=useState([])
  const [PhotoEmpoyee,setPhotoEployee]=useState('');
  const [isloading,setIsLoading]=useState(false);
  useEffect(() => {
    const getEmployeeId = async () => {
      try {
        const details = await AsyncStorage.getItem("employeeDetails");
        if (details !== null) {
          const parsedDetails = JSON.parse(details);
          setEmployeeDetails(parsedDetails); 
        }
        console.log('employee id in profile',employeeDetails.EmployeeId)
      } catch (error) {
        console.error("Error retrieving Employee Details:", error);
      }
    };
      getEmployeeId();
  }, []);
   useEffect(()=>{
    const getPhoto = async () => {
      try {
        setIsLoading(true);
        const mobileNo = await AsyncStorage.getItem("mobileNo");
        const token = await AsyncStorage.getItem('access_token');
    
        const url = `https://hrexim.tranzol.com/api/Employee/GetEmployee?mobileno=${mobileNo}`;
        console.log('url', url);
    
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
    
        const photoResponse = await response.json(); // ✅ await here
        setPhotoEployee(photoResponse.Photo);
        // console.log('photo', photoResponse.Photo);  
        // console.log('Type of PhotoEmpoyee:', typeof   PhotoEmpoyee);
      } catch (error) {
        console.error('Error fetching employee data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
getPhoto();
   },[])
   useEffect(() => {
    console.log('Updated PhotoEmpoyee:', PhotoEmpoyee);
  }, [PhotoEmpoyee]);
  
  const [showBankDetails, setshowBankDetails] = useState(false);
  const [showInsuranceDetails, setshowInsuranceDetails] = useState(false);
  const [showGeneralDetails, setshowGeneralDetails] = useState(true);
  const [showOfficialDetails, setshowOfficialDetails] = useState(false);
  const [showCommunicationDetails, setshowCommunicationDetails] = useState(false);

  const handleBankPress = () => {
    setshowBankDetails(!showBankDetails);
  };
  const handleInsurancePress = () => {
    setshowInsuranceDetails(!showInsuranceDetails);
  };
  const handleGeneralPress = () => {
    setshowGeneralDetails(!showGeneralDetails);
  };
  const handleOfficialPress = () => {
    setshowOfficialDetails(!showOfficialDetails);
  };
  const handleCommunicationPress = () => {
    setshowCommunicationDetails(!showCommunicationDetails);
  };

  return (
    <ScrollView>
      {console.log('photo in parents component',PhotoEmpoyee)}
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <ImageBackground
            source={require('../assets/menu-bg.jpeg')}
            style={styles.imgBack}>
            <View style={styles.imgContainer}>
              <Image
                source={{ uri: PhotoEmpoyee }}
                style={{ height: 100, width: 100, borderRadius: 50, borderWidth: 1, borderColor: 'white' }}
              />

              <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginLeft: 20 }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 14,
                    fontFamily: 'Roboto-Medium',
                    marginBottom: 4,
                    fontWeight: '500'
                  }}>
    {employeeDetails.Salutation+''}  {employeeDetails.FirstName}
                </Text>
                <Text style={{ fontSize: 12, color: 'white', fontWeight: '500', marginBottom: 4, }}>
                  BRANCH : {employeeDetails.BranchName}</Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Roboto-Regular',
                    fontSize: 12,
                    marginBottom: 4,
                  }}>
              {employeeDetails.OfficalEmail}
                </Text>
                <Text style={{
                  color: '#fff',
                  fontFamily: 'Roboto-Regular',
                  fontSize: 12
                }}>Employee Code : {employeeDetails.EmployeeCode}</Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 20 }}>
          <PanCard 
          employeeDetails={employeeDetails}
          PhotoEmpoyee={PhotoEmpoyee}
          
          />
          <AdharCard
           employeeDetails={employeeDetails}
           PhotoEmpoyee={PhotoEmpoyee}
          />
        </ScrollView>


        <TouchableOpacity
          style={[
            styles.button,
            showGeneralDetails ? styles.buttonWithDetails : styles.buttonWithoutDetails,
          ]}
          onPress={handleGeneralPress}
        >
          <Text style={styles.buttonText}>General Details</Text>
          <Text style={styles.arrowButton}>{showGeneralDetails ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showGeneralDetails && (
          <View style={styles.bottomContainer}>

            <View style={[styles.row]}>
              <View >
                <View>
                  <Text style={styles.txt1}>Mother's Name :</Text>
                  <Text style={styles.txt2}>{employeeDetails.MotherName}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>Company :</Text>
                  <Text style={styles.txt2}>{employeeDetails.CompanyName}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>Department :</Text>
                  <Text style={styles.txt2}>{employeeDetails.Department}</Text>
                </View>
                
                <View style={{ marginTop: 10 }}>
                   <Text style={styles.txt1}>Blood Group :</Text> 
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Fontisto name="blood-drop" size={18} color={'red'} />
                    <Text style={[styles.txt2, { marginLeft: 10 }]}>{employeeDetails.BloodGroup}</Text>
                  </View>

                </View>



              </View>
              <View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>Joining Date :</Text>
                  <Text style={styles.txt2}>{employeeDetails.JoiningDate? employeeDetails.JoiningDate.split('T')[0]:''}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>Division :</Text>
                  <Text style={styles.txt2}>{employeeDetails.Division}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>Designation :</Text>
                  <Text style={styles.txt2}>{employeeDetails.Designation}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>Grade :</Text>
                  <Text style={styles.txt2}>{employeeDetails.Grade}</Text>
                </View>

              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            showOfficialDetails ? styles.buttonWithDetails : styles.buttonWithoutDetails,
          ]}
          onPress={handleOfficialPress}
        >
          <Text style={styles.buttonText}>Official Details</Text>
          <Text style={styles.arrowButton}>{showOfficialDetails ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showOfficialDetails && (
          <View style={[styles.bottomContainer]}>
            <View style={[styles.row]}>
              <View >
                <View>
                  <Text style={styles.txt1}>PF No :</Text>
                  <Text style={[styles.txt2,{fontSize:12,marginRight:10}]}>{employeeDetails.PFNo}</Text>
                </View>
             
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>ESIC Date :</Text>
                  <Text style={styles.txt2}>{employeeDetails.EsicDate.split('T')[0]}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>Profession Tax :</Text>
                  <Text style={styles.txt2}>{employeeDetails.IsProfessionTax? 'YES': 'NO'}</Text>
                </View>
              </View>

              <View>
               
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>UAN :</Text>
                  <Text style={styles.txt2}>{employeeDetails.UAN}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>ESIC No :</Text>
                  <Text style={styles.txt2}>{employeeDetails.ESICNo}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>PF Applicable :</Text>
                  <Text style={styles.txt2}>{employeeDetails.IsPFApplicable? 'YES' : 'NO'}</Text>
                </View>
              </View>
            </View>
          </View>
        )}


        <TouchableOpacity
          style={[
            styles.button,
            showInsuranceDetails ? styles.buttonWithDetails : styles.buttonWithoutDetails,
          ]}
          onPress={handleInsurancePress}
        >
          <Text style={styles.buttonText}>Insurance Details</Text>
          <Text style={styles.arrowButton}>{showInsuranceDetails ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showInsuranceDetails && (
          <View style={[styles.bottomContainer, { padding: 0, overflow: 'hidden' }]}>
            <Insurance
            employeeDetails={employeeDetails}
            />
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.button,
            showCommunicationDetails ? styles.buttonWithDetails : styles.buttonWithoutDetails,
          ]}
          onPress={handleCommunicationPress}
        >
          <Text style={styles.buttonText}>Communication Details</Text>
          <Text style={styles.arrowButton}>{showCommunicationDetails ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showCommunicationDetails && (
          <View style={[styles.bottomContainer]}>
            <View style={[styles.row]}>
              <View >
                <View>
                  <Text style={styles.txt1}>Telephone :</Text>
                  <Text style={styles.txt2}>1234567890</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>Mobile No 2 :</Text>
                  <Text style={styles.txt2}>{employeeDetails.OfficalMobile}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>Emergency Contact Name :</Text>
                  <Text style={styles.txt2}>{employeeDetails.EmergencyName}</Text>
                </View>
              </View>

              <View>
                <View>
                  <Text style={styles.txt1}>Mobile No 1 :</Text>
                  <Text style={styles.txt2}>{employeeDetails.PersonalMobile}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>Personal Email :</Text>
                  <Text style={styles.txt2}></Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>Emergency Contact No :</Text>
                  <Text style={styles.txt2}>{employeeDetails.EmergencyContact}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            showBankDetails ? styles.buttonWithDetails :
              [styles.buttonWithoutDetails, { marginBottom: 30 }],

          ]}
          onPress={handleBankPress}
        >
          <Text style={styles.buttonText}>Bank Details</Text>
          <Text style={styles.arrowButton}>{showBankDetails ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showBankDetails && (
          <View style={[styles.bottomContainer, { marginBottom: 30, }]}>
            {/* Add your view with text components here */}
            <View style={[styles.row]}>
              <View>
                <View>
                  <Text style={styles.txt1}>Payment Mode :</Text>
                  <Text style={styles.txt2}>Bank</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>Bank Branch :</Text>
                  <Text style={styles.txt2}></Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>IFSC Code :</Text>
                  <Text style={styles.txt2}>{employeeDetails.IFSCCode}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>Account Holder Name :</Text>
                  <Text style={styles.txt2}>{employeeDetails.AccountName}</Text>
                </View>
              </View>

              <View>
                <View>
                  <Text style={styles.txt1}>Bank :</Text>
                  <Text style={styles.txt2}>{employeeDetails.BankName}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>Account No :</Text>
                  <Text style={styles.txt2}>{employeeDetails.AccountNo}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>MICR Code :</Text>
                  <Text style={styles.txt2}>{employeeDetails.MICRCode}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.txt1}>Nominee :</Text>
                  <Text style={styles.txt2}>{employeeDetails.Nominee}</Text>
                </View>
              </View>
            </View>
          </View>
        )}



      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  buttonWithoutDetails: {
    borderRadius: 10,
    // marginBottom: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 0.8,
    borderColor: 'lightgray',
  },
  buttonWithDetails: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8d7f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 14,

  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#aa18ea',
  },
  arrowButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#aa18ea',
  },
  container: {
    flex: 1,
    backgroundColor: '#e9e6eb',
    // height: '100%'
  },
  topContainer: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    height: 150,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imgBack: {
    height: 150,
    width: '100%'
  },
  imgContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center'
  },
  bottomContainer: {
    alignItems: 'stretch',
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20
  },
  lable: {
    fontSize: 15,
    fontWeight: '600',
    color: 'black',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 25,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  txt1: {
    color: 'gray',
    fontSize: 12
  },
  txt2: {
    color: 'black',
    fontSize: 15,
    fontWeight: '700'
  },
  panView: {
    height: 190,
    width: 295,
    margin: 8,
    marginLeft: 20,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  adharView: {
    height: 190,
    width: 295,
    margin: 8,
    marginRight: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 0.7,
    borderColor: 'lightgray',
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  txt3: {
    color: 'blue',
    fontSize: 10,
    fontWeight: '500'
  },
  txt4: {
    color: 'black',
    fontSize: 10,
    fontWeight: '600'
  },
  txt5: {
    color: 'gray',
    fontSize: 10,
    fontWeight: '500',
    marginRight: 6
  },
  txt6: {
    color: 'black',
    fontSize: 10,
    fontWeight: '600',
  }
})

export default EProfile



const PanCard = ({employeeDetails ,PhotoEmpoyee}) => {
  const [imageError, setImageError] = useState(false);
  const Details=employeeDetails
  // console.log('photo in component',PhotoEmpoyee)
  //  console.log('Details',employeeDetails)
  if (!Details) {
    return <Text>Loading details...</Text>;
  }

  return (
    <View style={styles.panView}>
      <ImageBackground
        source={require('../assets/pan-card.png')}
        style={{
          height: 200,
          width: 300,
          alignSelf: 'center'
        }}
      >
        <View style={{ marginTop: 50, marginLeft: 16 }}>
          <Text style={styles.txt3}>Permanent Account Number :</Text>
          <Text style={[styles.txt4, { marginTop: 2, fontSize: 14, fontWeight: 'bold' }]}>{Details.PanNo}</Text>
        </View>
        <View style={{ marginTop: 4, marginLeft: 16 }}>
          <Text style={styles.txt3}>Name :</Text>
          <Text style={styles.txt4}>{ Details.FirstName}</Text>
        </View>
        <View style={{ marginTop: 6, marginLeft: 16 }}>
          <Text style={styles.txt3}>Father's Name :</Text>
          <Text style={styles.txt4}>{Details.FatherName}</Text>
        </View>
        <View style={{ marginTop: 6, marginLeft: 16, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.txt3}>Date of Barth :</Text>
    <Text style={[styles.txt4, { marginLeft: 6 }]}>{Details.BirthDate?Details.BirthDate.split('T')[0]:''}</Text>
        </View>

     
   
          {PhotoEmpoyee && typeof PhotoEmpoyee === 'string' && !imageError ? (
            <Image
              source={{ uri: PhotoEmpoyee }}
              style={{ width: 55, height: 65, position:'absolute',bottom:16,right:20 }}  // Larger size to confirm image loading
              
             
            />
          ) : imageError ? (
            <Text>Failed to load image</Text> // Fallback text if image fails
          ) : null}
      





      </ImageBackground>
    </View>
  )
}

const AdharCard = ({employeeDetails,PhotoEmpoyee}) => {
  const [imageError, setImageError] = useState(false);
  const Details=employeeDetails
  return (
    <View style={styles.adharView}>
      <ImageBackground
        source={require('../assets/aadhaar.png')}
        style={{
          height: 200,
          width: 300,
           
        }}
      >
        <View style={{ marginTop: 50, marginLeft: 95, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.txt5}>Name :</Text>
          <Text style={styles.txt6}>{Details.FirstName}</Text>
        </View>
        <View style={{ marginTop: 4, marginLeft: 95, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.txt5}>DOB :</Text>
          <Text style={styles.txt6}>{Details.BirthDate?Details.BirthDate.split('T')[0]:""}</Text>
        </View>
        <View style={{ marginTop: 4, marginLeft: 95 }}>
          <Text style={styles.txt5}>Address :</Text>
          <Text style={[styles.txt6, { width: 130 ,marginLeft:55,marginTop:-20,height:80}]}>{Details.PermanentAddress?Details.PermanentAddress:""}</Text>
        </View>
        <Text style={{
          color: 'black',
          position: 'absolute',
          bottom: 13,
          left: 80,
          fontSize: 14,
          fontWeight: '700'
        }}>{Details.AadharNo}</Text>
          {PhotoEmpoyee && typeof PhotoEmpoyee === 'string' && !imageError ? (
            <Image
              source={{ uri: PhotoEmpoyee }}
              style={{ width: 75, height: 94, position:'absolute',top:58,left:12 ,}}  // Larger size to confirm image loading
            
             
            />
          ) : imageError ? (
            <Text>Failed to load image</Text> // Fallback text if image fails
          ) : null}
      </ImageBackground>
    </View>
  )
}