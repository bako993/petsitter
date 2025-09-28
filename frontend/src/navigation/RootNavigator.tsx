import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import { AppStackParams } from '@/src/types/types';


const Stack = createNativeStackNavigator<AppStackParams>();

const screenOptions = {
    headerShown: false,
}

export default function RootNavigator() {
    return (
        <Stack.Navigator initialRouteName="MainTabs" screenOptions={screenOptions}>
            <Stack.Screen
                name="MainTabs"
                component={MainTabs}
            />
        </Stack.Navigator>
    );
}
