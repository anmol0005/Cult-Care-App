import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { Dashboard } from '../screens/Dashboard';
import { EnterPatientScreen } from '../screens/EnterPatientScreen';
import { MakeAppointmentScreen } from '../screens/MakeAppointmentScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  EnterPatient: undefined;
  MakeAppointment: { patientId?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="EnterPatient" component={EnterPatientScreen} />
      <Stack.Screen name="MakeAppointment" component={MakeAppointmentScreen} />
    </Stack.Navigator>
  );
};
