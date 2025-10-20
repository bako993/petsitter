import React from "react";
import { Platform } from "react-native";
import { render } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParams } from '@/src/types/types';
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import SitterScreen from "@/src/screens/SitterScreen";
import SearchScreen from "@/src/screens/SearchScreen";
import LoginScreen from "@/src/screens/Auth/LoginScreen";
import SignupScreen from "@/src/screens/Auth/SignupScreen";
import locationCompletionScreen from "@/src/screens/Onboarding/LocationCompletionScreen";
import OfferingCompletionScreen from "@/src/screens/Onboarding/OfferingCompletionScreen";
import OwnerProfileScreen from "@/src/screens/Profile/OwnerProfileScreen";

const screens = [
    { name: "HomeScreen", Component: HomeScreen },
    { name: "MapScreen", Component: MapScreen },
    { name: "SearchScreen", Component: SearchScreen },
    { name: "SitterScreen", Component: SitterScreen },
    { name: "LoginScreen", Component: LoginScreen },
    { name: "SignupScreen", Component: SignupScreen },
    { name: "locationCompletionScreen", Component: locationCompletionScreen },
    { name: "OfferingCompletionScreen", Component: OfferingCompletionScreen },
    { name: "OwnerProfileScreen", Component: OwnerProfileScreen },
];

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setParams: jest.fn(),
    replace: jest.fn(),
    reset: jest.fn(),
} as unknown as NativeStackNavigationProp<AppStackParams, 'SitterScreen'>;

const mockRoute = {
    params: {},
} as any;
describe("Cross-platform snapshot tests", () => {
    ["android", "ios"].forEach((os) => {
        screens.forEach(({ name }) => {
            it(`${name} renders correctly on ${os}`, () => {
                Object.defineProperty(Platform, "OS", { get: () => os });

                const { toJSON } = render(
                    <SafeAreaProvider>
                        <SitterScreen navigation={mockNavigation} route={mockRoute} />
                    </SafeAreaProvider>
                );
                expect(toJSON()).toMatchSnapshot();
            });
        });
    });
});
