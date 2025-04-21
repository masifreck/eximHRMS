import React, { useState ,useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import PayslipSummary from '../component/PayslipSummary';
import MonthYearPicker from '../component/MonthYearPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../component/Loading';
import RNPrint from 'react-native-print';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {SalaryHTML} from '../component/HTMLSALRY'
const renderDot = color => {
  return (
    <View
      style={{
        height: 16,
        width: 16,
        borderRadius: 8,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
  );
};

const renderLegendComponent = (salaryDetail) => {
  return (
    <View style={{ justifyContent: 'center', }}>
      <View style={{}}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
          {renderDot('green')}
          <View>
            <Text style={{ color: 'black', fontWeight: "bold", fontSize: 16 }}>₹ {salaryDetail.totalEarning || 0}</Text>
            <Text style={{ color: 'gray' }}>Earnings</Text>
          </View>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', width: 120, marginTop: 20 }}>
          {renderDot('orange')}
          <View>
            <Text style={{ color: 'black', fontWeight: "bold", fontSize: 16 }}>₹ {salaryDetail.totalDeduction}</Text>
            <Text style={{ color: 'gray' }}>Deductions</Text>
          </View>
        </View>
      </View>
    </View>
  );
};



const Salaryslip = ({navigation}) => {
  const [salaryDetail,setSlaryDetails]=useState('');
  const [showIssueBox, setShowIssueBox] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const [issue, setIssue] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(''); // default current month
  const [selectedYear, setSelectedYear] = useState('');
  const handleMonthYearChange = (month, year) => {
    const date = new Date(year, month - 1); // month is 0-indexed
    const monthName = date.toLocaleString('default', { month: 'long' });
  
    console.log(`Fetching data for: ${monthName} ${year}`);
  
    setSelectedMonth(monthName); // or store month number if needed for API
    setSelectedYear(year);
  };
  function numberToWords(num) {
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", 
      "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
    const convert = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
      if (n < 1000)
        return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convert(n % 100) : "");
      return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + convert(n % 1000) : "");
    };
  
    if (num === 0) return "Zero";
    const [integer, fraction] = num.toString().split(".");
    const integerPart = convert(parseInt(integer, 10));
    const fractionPart = fraction ? `and ${convert(parseInt(fraction, 10))} Cents` : "";
    return `${integerPart} ${fractionPart}`.trim();
  }


  const handlePrintButtonPress = async () => {
    try {
     const netPayinWords=numberToWords(salaryDetail.NetPayable)
      const result = await RNHTMLtoPDF.convert({
        html: `${SalaryHTML(salaryDetail,netPayinWords)}`,
        fileName: 'salary.pdf',
        directory: 'Documents',
      });
      setFilePath(result.filePath); // Save filePath for sharing or printing
      await RNPrint.print({ filePath: result.filePath }); // Automatically show the PDF
    } catch (error) {
      console.log('Error generating PDF: ', error);
      setErrorMessage('Error generating PDF');
      setShowAlert(true);
    }
  };
const [loading,setLoading]=useState(false);
  useEffect(() => {
    const checkLoginStatus = async () => {
      setLoading(true);
      try {
        const mobileNo = await AsyncStorage.getItem('mobileNo');
        const token = await AsyncStorage.getItem('access_token');
        const password = await AsyncStorage.getItem('password');

        if (!mobileNo || !token) {
          navigation.replace('newlogin');
          return;
        }
     
        const url = `https://hrexim.tranzol.com/api/Employee/GetEmployeeSalary?MobileNo=${mobileNo}&MonthName=${selectedMonth}&Year=${selectedYear}`
     console.log('url',url)
        const response=await fetch(url,{
      method:'GET',
      headers:{
        Authorization: `Bearer ${token}`,
        'Content-Type':'application/json',
      }

     })
     if (!response.ok) {
      throw new Error('Invalid response from server');
    }
    const salaryDetails=await response.json();
    console.log('salary details',salaryDetails);
    setSlaryDetails(salaryDetails);
      } catch (error) {
        console.error('Error fetching employee data:', error.message);
        //navigation.replace('newlogin');
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
    // Fetch salary slip here with selectedMonth and selectedYear
  
    console.log('Fetching data for:', selectedMonth, selectedYear);
    
  }, [selectedMonth, selectedYear,navigation]);
 
  const showInput = () => {
    return (
      <View>
       { loading ?(

          <Loading/>
        ):(
        <View style={{
          // backgroundColor:"red",
          marginHorizontal: 10,
          height: 70,
          borderRadius: 8,
          borderColor: 'gray',
          borderWidth: 0.8,
          marginVertical: 8,
          flexDirection:'row',
          justifyContent:'space-between'
        }}>
          <TextInput
            style={{
              width: '70%',
              marginHorizontal: 10,
              color: 'black',
              fontSize: 14,
            }}
            placeholder="Write your Issue !"
            placeholderTextColor={'gray'}
            multiline={true}
            onChangeText={(text) => setIssue(text)} />
          <View style={{
            marginRight:10,
            alignItems:'center'
          }}>
            <TouchableOpacity style={styles.cancel}>
              <Text style={{color:'white',fontSize:12}}>Cencel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submit}>
              <Text style={{color:'white',fontSize:12}}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>)}

      </View>
    )
  }

  return (
    <>
    { loading ?(

      <Loading/>
      ):( 
      
    <ScrollView style={styles.container}>

    <MonthYearPicker onMonthYearChange={handleMonthYearChange} />
      {/* <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 19,textAlign:'center',marginTop:8 }}>January 2023</Text> */}
  

      <View style={{
        marginHorizontal: 30,
        paddingVertical: 10,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <PayslipSummary 
        salaryDetail={salaryDetail}
        />
        {renderLegendComponent(salaryDetail)}
      </View>

      <View style={styles.btnView}>
        <TouchableOpacity style={[styles.btn, {
          width: '60%',
          backgroundColor: 'lightgray',
          borderWidth: 0.5,
          borderColor: 'gray'
        }]} disabled onPress={() => { setShowIssueBox(true) }}>
          <Text style={[styles.txt, { color: 'black' }]}>{selectedMonth +" " + selectedYear}</Text>
        </TouchableOpacity>


        <TouchableOpacity style={[styles.btn, { width: '30%', backgroundColor: '#aa18ea' }]} onPress={handlePrintButtonPress}>
          <Text style={styles.txt}>Download</Text>
        </TouchableOpacity>
      </View>

      {showIssueBox && showInput()}

      <Text style={[styles.label, { paddingBottom: 8, }]}>Earnings</Text>
      <View style={styles.insideContainer}>
        {/* Basic */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text}>Basic</Text>
          <Text style={[styles.money, { color: 'green' }]}>₹ {salaryDetail.BasicSalary}</Text>
        </View>
        {/* Medical Allowance */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>Medical Allowance</Text>
          <Text style={[styles.money, { color: 'green' }]}>₹ {salaryDetail.FixedMedicalAllowance}</Text>
        </View>
        {/* HRA */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>HRA</Text>
          <Text style={[styles.money, { color: 'green' }]}>₹ {salaryDetail.HRA}</Text>
        </View>
        {/* Conveyance */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>Conveyance</Text>
          <Text style={[styles.money, { color: 'green' }]}>₹ {salaryDetail.Conveyance}</Text>
        </View>
        {/* Entertainment */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>Entertainment</Text>
          <Text style={[styles.money, { color: 'green' }]}>₹ {salaryDetail.Entertainment}</Text>
        </View>
        {/* Uniform */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>Uniform</Text>
          <Text style={[styles.money, { color: 'green' }]}>₹ {salaryDetail.Uniform}</Text>
        </View>
        {/* Arrears */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>Arrears</Text>
          <Text style={[styles.money, { color: 'green' }]}>₹ {salaryDetail.Arrear || 0}</Text>
        </View>
        {/* Total */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 12,
          borderTopColor: 'gray',
          borderTopWidth: 0.8
        }}>
          <Text style={{
            marginTop: 6,
            color: 'black',
            fontSize: 17,
            fontWeight: 'bold'
          }}>Total :</Text>
          <Text style={{
            marginTop: 6,
            color: 'black',
            fontSize: 17,
            fontWeight: 'bold',
            color: 'green'
          }}>₹ {salaryDetail.totalEarning || 0}</Text>
        </View>
      </View>
      {/* Deductions */}
      <Text style={[styles.label, { paddingVertical: 8 }]}>Deductions</Text>
      <View style={styles.insideContainer}>
        {/* Provident Fund */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text}>Provident Fund</Text>
          <Text style={[styles.money, { color: 'orange' }]}>₹ {salaryDetail.ProvidentFund || 0}</Text>
        </View>
        {/* ESIC Employee */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>Salary Advance</Text>
          <Text style={[styles.money, { color: 'orange' }]}>₹ {salaryDetail.SalaryAdvance}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>TDS</Text>
          <Text style={[styles.money, { color: 'orange' }]}>₹ {salaryDetail.Tds}</Text>
        </View>
        {/* Loan */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>Loan</Text>
          <Text style={[styles.money, { color: 'orange' }]}>₹ {salaryDetail.Loan || 0}</Text>
        </View>
        {/* Adjustments */}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>Penality</Text>
          <Text style={[styles.money, { color: 'orange' }]}>₹ {salaryDetail.Penalty || 0}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>Professional Tax</Text>
          <Text style={[styles.money, { color: 'orange' }]}>₹ {salaryDetail.ProfessionalTax || 0}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>Food Deduction</Text>
          <Text style={[styles.money, { color: 'orange' }]}>₹ {salaryDetail.FoodDeduction || 0}</Text>
        </View>
        {/* Other Deduction */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>Other Deduction</Text>
          <Text style={[styles.money, { color: 'orange' }]}>₹ {salaryDetail.OtherDeduction || 0}</Text>
        </View>
        {/* Total */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 12,
          borderTopColor: 'gray',
          borderTopWidth: 0.8
        }}>
          <Text style={{
            marginTop: 6,
            color: 'black',
            fontSize: 17,
            fontWeight: 'bold'
          }}>Total Deduction:</Text>
          <Text style={{
            marginTop: 6,
            color: 'black',
            fontSize: 17,
            fontWeight: 'bold',
            color: 'red'
          }}>₹ {salaryDetail.totalDeduction || 0}</Text>
        </View>
      </View>
      {/* Employer Contribution */}
      <Text style={[styles.label, { paddingVertical: 8 }]}>Employer Contribution</Text>
      <View style={[styles.insideContainer, { marginBottom: 30 }]}>
        {/* ESIC Employer */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text}>ESIC Employer</Text>
          <Text style={[styles.money, { color: 'orange' }]}>₹ {salaryDetail.ESICEmployer || 0}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>EPF Employer</Text>
          <Text style={[styles.money, { color: 'orange' }]}>₹ {salaryDetail.EPFEPSDifference || 0}</Text>
        </View> 
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>EPF Admin Charges</Text>
          <Text style={[styles.money, { color: 'orange' }]}>₹ {salaryDetail.PFAdminCharges || 0}</Text>
        </View> 
        {/* Provident Fund */}
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>Provident Fund</Text>
          <Text style={[styles.money, { color: 'orange' }]}>₹ 329.00</Text>
        </View>
        {/* Pension Fund */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>EPS Employer Share</Text>
          <Text style={[styles.money, { color: 'orange' }]}>₹ {salaryDetail.EPSRemitted || 0}</Text>
        </View> 
        {/* Total */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 12,
          borderTopColor: 'gray',
          borderTopWidth: 0.8
        }}>
          <Text style={{
            marginTop: 6,
            color: 'black',
            fontSize: 17,
            fontWeight: 'bold'
          }}>Total Contribution:</Text>
          <Text style={{
            marginTop: 6,
            color: 'black',
            fontSize: 17,
            fontWeight: 'bold',
            color: 'green'
          }}>₹ {salaryDetail.totalEmployer || 0}</Text>
        </View>
      </View>
      <Text style={[styles.label, { paddingVertical: 8 }]}>Net Payment</Text>
      <View style={[styles.insideContainer, { marginBottom: 30 }]}>
        {/* ESIC Employer */}
       
        {/* Provident Fund */}
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>Provident Fund</Text>
          <Text style={[styles.money, { color: 'orange' }]}>₹ 329.00</Text>
        </View>
        {/* Pension Fund */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text}>Net Pay</Text>
          <Text style={[styles.money, { color: 'green' }]}>₹ {salaryDetail.NetPayable || 0}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={styles.text}>Net Pay in Words</Text>
          {salaryDetail.NetPayable ? (
  <Text style={[styles.text, { marginTop: 4, fontStyle: 'italic', color: '#555',width:'60%',marginLeft:10,marginRight:10}]}>
    (In Words: {numberToWords(salaryDetail.NetPayable)})
  </Text>
) : null}
        </View> 
        {/* Total */}
       
      </View>
      
    </ScrollView>)}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  insideContainer: {
    padding: 20,
    width: '95%',
    marginHorizontal: 10,
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
    overflow: 'hidden'
  },
  btnView: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  btn: {
    height: 45,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  txt: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    marginLeft: 14,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  text: {
    color: 'gray',
    fontSize: 15,
    fontWeight: '500'
  },
  money: {
    fontSize: 15,
    fontWeight: '600'
  },
  cancel: {
    backgroundColor: 'red',
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop:8
  },
  submit: {
    backgroundColor: 'green',
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop:10
  }
});

export default Salaryslip;
