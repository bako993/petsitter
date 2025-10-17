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
import OwnerProfileScreen from "@/src/screens/Profile/OwnerProfileScreen";
import SitterProfileScreen from "@/src/screens/Profile/SitterProfileScreen";
import OfferingCompletionScreen from "@/src/screens/Onboarding/OfferingCompletionScreen"
import LocationCompletionScreen from "@/src/screens/Onboarding/LocationCompletionScreen"
import ProfileCompletionScreen from "@/src/screens/Onboarding/ProfileCompletionScreen"

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
                        <Stack.Screen name="SitterProfileScreen" component={SitterProfileScreen} />
                        <Stack.Screen name="OwnerProfileScreen" component={OwnerProfileScreen} />
                        <Stack.Screen name={"ProfileCompletionScreen"} component={ProfileCompletionScreen} />
                        <Stack.Screen name="OfferingCompletionScreen" component={OfferingCompletionScreen} />
                        <Stack.Screen name="LocationCompletionScreen" component={LocationCompletionScreen} />
                    </Stack.Navigator>
                )}
            </AuthGate>
        </>
    );
}
