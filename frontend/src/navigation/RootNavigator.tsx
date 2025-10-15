import React from 'react';
import { StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import LoginScreen from '@/src/screens/Auth/LoginScreen';
import SignupScreen from '@/src/screens/Auth/SignupScreen';
import { AppStackParams } from '@/src/types/types';
import { Theme } from '@/src/theme/theme';
import AuthGate from '@/src/components/AuthGate';
import WelcomeScreen from "@/src/screens/WelcomeScreen";
import SitterOnboardingScreen from "@/src/screens/SitterOnboardingScreen";
import OwnerProfileScreen from "@/src/screens/Profile/OwnerProfileScreen";
import SitterProfileScreen from "@/src/screens/Profile/SitterProfileScreen";
import OfferingScreen from "@/src/screens/OfferingScreen";

const Stack = createNativeStackNavigator<AppStackParams>();

export default function RootNavigator() {
    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={Theme.COLORS.background} />
            <AuthGate>
                {(isLoggedIn) => (
                    <Stack.Navigator initialRouteName={isLoggedIn ? 'MainTabs' : 'WelcomeScreen'} screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
                        <Stack.Screen name="LoginScreen" component={LoginScreen} />
                        <Stack.Screen name="SignupScreen" component={SignupScreen} />
                        <Stack.Screen name="MainTabs" component={MainTabs} />
                        <Stack.Screen name="SitterOnboardingScreen" component={SitterOnboardingScreen} />
                        <Stack.Screen name="SitterProfileScreen" component={SitterProfileScreen} />
                        <Stack.Screen name="OwnerProfileScreen" component={OwnerProfileScreen} />
                        <Stack.Screen name="OfferingScreen" component={OfferingScreen} />
                    </Stack.Navigator>
                )}
            </AuthGate>
        </>
    );
}
