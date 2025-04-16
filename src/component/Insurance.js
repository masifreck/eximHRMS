
import React, { useEffect ,useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Insurance = (employeeDetails) => {
    // Dummy data
    const Details=employeeDetails.employeeDetails
    const insurances = [
        {
            amount: '10,000',
            active: true,
            policyNumber: 'AG00061851234567',
            issueDate: '2023-01-01',
            expiryDate: '2024-01-01',
            companyName: 'Royal Sundaram Feneral Insurance co. Ltd(GPA)',
            insuranceType: 'Group Personal Accident(GPA)',
            nomineeName: 'John Doe',
        },

    ];

    // Determine the text color based on active status
   
    const [isActive, setIsActive] = useState(true); // Initial state set to true

    useEffect(() => {
      if (Details?.PolicyExpiryDate) {
        const expiryDate = new Date(Details.PolicyExpiryDate.split('T')[0]);
        const currentDate = new Date();
  
        // Compare dates
        if (expiryDate < currentDate) {
          setIsActive(false); // Set isActive to false if expiry date is in the past
        }
      }
    }, [Details]);
    const textColor = isActive? 'green' : 'red';
    return (
        <View style={styles.container}>
            {insurances.length > 0 ? (
                insurances.map((insurance, index) => (
                    <View key={index}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.amount}>
                        
                            </Text>

                            <View style={styles.StsTypeContainer}>
                                <Text style={[styles.statusText, { color: isActive ? 'green' : 'red' }]}>
                                    {isActive ? 'Active' : 'Expired'}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.txt, { marginTop: 6 }]}>
                            {Details.InsuranceCmp}
                        </Text>

                        <View style={styles.policyDatesContainer}>
                            <View>
                                <Text style={styles.policyDateLabel}>Issue Date:</Text>
                                <Text style={styles.policyDateValue}>{Details.PolicyIssueDate?Details.PolicyIssueDate.split('T')[0]:''}</Text>
                            </View>
                            <View>
                                <Text style={styles.policyDateLabel}>Expiry Date:</Text>
                                <Text style={styles.policyDateValue}>{Details.PolicyExpiryDate?Details.PolicyExpiryDate.split('T')[0]:''}</Text>
                            </View>
                        </View>
                        <Text style={styles.policyInfo}>
                            Policy Number   :   <Text style={styles.txt}>{Details.PolicyNo}</Text>
                        </Text>
                        <Text style={styles.insuranceInfo}>
                            Insurance Type  :   <Text style={styles.txt}>{}</Text>
                        </Text>
                        <Text style={styles.insuranceInfo}>
                            Nominee Name :   <Text style={styles.txt}>{Details.Nominee}</Text>
                        </Text>

                        {index !== insurances.length - 1 && <View style={styles.divider} />}
                    </View>
                ))
            ) : (
                <Text style={[styles.noInsuranceMessage, { color: textColor }]}>No insurance found</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    StsTypeContainer: {
        borderWidth: 0.8,
        borderColor: 'green',
        borderRadius: 8,
        paddingVertical: 3.5,
        paddingHorizontal: 6,
        alignSelf: 'center'
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 20,
    },
    amount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green'
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600'
    },
    policyInfo: {
        marginTop: 6,
        fontSize: 16,
        color: 'gray',
        textAlign: 'left',
    },
    txt: {
        fontSize: 14,
        fontWeight: '700',
        color: 'black',
    },
    policyDatesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    policyDateLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'gray'
    },
    policyDateValue: {
        fontSize: 14,
        marginTop: 5,
        color: 'black',
        fontWeight: '500'
    },
    insuranceInfo: {
        marginTop: 6,
        fontSize: 16,
        color:'gray'
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginVertical: 12,
    },
    noInsuranceMessage: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
});

export default Insurance;
