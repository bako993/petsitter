import React from 'react';
import { StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import LoginScreen from '@/src/screens/LoginScreen';
import SignupScreen from '@/src/screens/SignupScreen';
import { AppStackParams } from '@/src/types/types';
import { Theme } from '@/src/theme/theme';
import AuthGate from '@/src/components/AuthGate';
import WelcomeScreen from "@/src/screens/WelcomeScreen";
import SitterOnboardingScreen from "@/src/screens/SitterOnboardingScreen";

const Stack = createNativeStackNavigator<AppStackParams>();

export default function RootNavigator() {
    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={Theme.COLORS.background} />
            <AuthGate>
                {(isLoggedIn) => (
                    <Stack.Navigator
                        initialRouteName={isLoggedIn ? 'MainTabs' : 'WelcomeScreen'}
                        screenOptions={{ headerShown: false }}
                    >
                        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
                        <Stack.Screen name="LoginScreen" component={LoginScreen} />
                        <Stack.Screen name="SignupScreen" component={SignupScreen} />
                        <Stack.Screen name="MainTabs" component={MainTabs} />
                        <Stack.Screen name="SitterOnboardingScreen" component={SitterOnboardingScreen} />
                    </Stack.Navigator>
                )}
            </AuthGate>
        </>
    );
}
