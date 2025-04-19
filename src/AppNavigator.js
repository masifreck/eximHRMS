import React from 'react'
// import Onboarding from './screen/Onboarding';
import Home from './screen/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigation from './DrawerNavigation';
import Punch from './screen/Punch';
import NewLeave from './screen/NewLeave';
import LeaveSts from './screen/LeaveSts';
import NewReimbursementRequest from './screen/NewReimbursementRequest';
import NewExpense from './screen/NewExpense';
import ReimbursementSts from './screen/ReimbursementSts';
import NewSplash from '../screen/Splash';
import Newlogin from './screen/Newlogin';
import EProfile from './screen/EProfile';
import AttnHistory from './screen/AttnHistory';
import Leave from './screen/Leave';
import Reimbursement from './screen/Reimbursement';
import HolidayList from './screen/HolidayList';
import Salaryslip from './screen/Salaryslip';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {

    return (

        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* <Stack.Screen
                    name="Onboarding"
                    component={Onboarding}
                    options={{ headerShown: false }}
                /> */}
           
                
<Stack.Screen 
name='splash' component={NewSplash} 
options={{headerShown:false}}/>

<Stack.Screen name='newlogin' component={Newlogin}/>

  

<Stack.Screen
                    name='DrawerNavigation'
                    component={DrawerNavigation}
                    options={{ headerShown: false }} />

                <Stack.Screen
                    name='Home'
                    component={Home}
                    options={{ headerShown: false }} />
                   
                 <Stack.Screen
                 name='EProfile'
                 component={EProfile}
                 options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#aa18ea',
                    },
                    title: 'Punch Attendance',
                    headerTintColor: 'white'
                }}
                 />
                 <Stack.Screen
        name="Leave"
        component={Leave}
        options={{
          headerShown: true,
          drawerIcon: ({color}) => (
            <Entypo name="aircraft-take-off" size={22} color={color} />
          ),
          headerStyle: {
            backgroundColor: '#aa18ea',
          },
          headerTintColor: 'white',
          title: 'My Leaves',
        }}
      />
                <Stack.Screen
                    name='Punch'
                    component={Punch}
                    options={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: '#aa18ea',
                        },
                        title: 'Punch Attendance',
                        headerTintColor: 'white'
                    }} />
                <Stack.Screen
                    name='NewLeave'
                    component={NewLeave}
                    options={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: '#aa18ea',
                        },
                        title: 'Request New Leave',
                        headerTintColor: 'white'
                    }} />
                    <Stack.Screen
        name="AttnHistory"
        component={AttnHistory}
        options={{
          headerShown: true,
          drawerIcon: ({color}) => (
            <Ionicons name="calendar-sharp" size={22} color={color} />
          ),
          headerStyle: {
            backgroundColor: '#aa18ea',
          },
          title: 'Attendance History',
          headerTintColor: 'white',
        }}
      />
                <Stack.Screen
                    name='LeaveSts'
                    component={LeaveSts}
                    options={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: '#aa18ea',
                        },
                        title: 'Leave Status',
                        headerTintColor: 'white'
                    }} />
                <Stack.Screen
                    name='NewReimbursementRequest'
                    component={NewReimbursementRequest}
                    options={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: '#aa18ea',
                        },
                        title: 'New Reimbursement Request',
                        headerTintColor: 'white'
                    }} />
                <Stack.Screen
                    name='NewExpense'
                    component={NewExpense}
                    options={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: '#aa18ea',
                        },
                        title: 'Add New Expense',
                        headerTintColor: 'white'
                    }} />
                <Stack.Screen
                    name='ReimbursementSts'
                    component={ReimbursementSts}
                    options={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: '#aa18ea',
                        },
                        title: 'Reimbursement Status',
                        headerTintColor: 'white'
                    }} />
                      <Stack.Screen
        name="Reimbursement"
        component={Reimbursement}
        options={{
          headerShown: true,
          drawerIcon: ({color}) => (
            <FontAwesome5 name="file-invoice-dollar" size={22} color={color} />
          ),
          headerStyle: {
            backgroundColor: '#aa18ea',
          },
          headerTintColor: 'white',
          title: 'Reimbursement',
        }}
      />
       <Stack.Screen
        name="holidays"
        component={HolidayList}
        options={{
          headerShown: true,
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons
              name="file-document-outline"
              size={22}
              color={color}
            />
          ),
          headerStyle: {
            backgroundColor: '#aa18ea',
          },
          headerTintColor: 'white',
          title: 'My Holidays',
        }}
      />
       <Stack.Screen
        name="Salaryslip"
        component={Salaryslip}
        options={{
          headerShown: true,
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons
              name="file-document-outline"
              size={22}
              color={color}
            />
          ),
          headerStyle: {
            backgroundColor: '#aa18ea',
          },
          headerTintColor: 'white',
          title: 'My Salary Slip',
        }}
      />
            </Stack.Navigator>
        </NavigationContainer>
    )

}

export default AppNavigator