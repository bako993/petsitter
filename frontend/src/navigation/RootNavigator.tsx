import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import { AppStackParams } from '@/src/types/types';
import {Theme} from "@/src/theme/theme";
import {StatusBar} from "react-native";


const Stack = createNativeStackNavigator<AppStackParams>();

const screenOptions = {
    headerShown: false,
}

export default function RootNavigator() {
    return (
        <>
            <StatusBar barStyle={"dark-content"} backgroundColor={Theme.COLORS.background} />
                <Stack.Navigator initialRouteName="MainTabs" screenOptions={screenOptions}>
                    <Stack.Screen
                        name="MainTabs"
                        component={MainTabs}
                    />
                </Stack.Navigator>
        </>
    );
}
