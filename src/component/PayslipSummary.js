import React from 'react';
import { Text, View } from 'react-native';
import { PieChart } from "react-native-gifted-charts";

const PayslipSummary = ({ salaryDetail }) => {
    const earning = parseFloat(salaryDetail?.totalEarning) || 0;
    const deduction = parseFloat(salaryDetail?.totalDeduction) || 0;

    const pieData = [
        {
            value: earning,
            color: 'green',
            gradientCenterColor: 'lightgreen',
            focused: true,
        },
        {
            value: deduction,
            color: 'orange',
            gradientCenterColor: 'yellow',
        },
    ];

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', width: 120 }}>
            <PieChart
                data={pieData}
                showGradient
                sectionAutoFocus
                radius={60}
                innerRadius={40}
                innerCircleColor={'#232B5D'}
                centerLabelComponent={() => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: 'white' ,textAlign:'center' }}>
                            Gross Pay
                        </Text>
                        <Text style={{ fontSize: 10, color: 'white' ,textAlign:'center' }}>
                    {salaryDetail?.GrossSalary || ''}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};

export default PayslipSummary;
