import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '@/src/screens/HomeScreen';
import SearchScreen from '@/src/screens/SearchScreen';
import OwnerProfileScreen from '@/src/screens/Profile/OwnerProfileScreen';
import SitterProfileScreen from '@/src/screens/Profile/SitterProfileScreen';
import MapScreen from '@/src/screens/MapScreen';
import { Theme } from '../theme/theme';
import { ICONS } from "@/src/constants/icons";
import { BottomTabParams } from '@/src/types/types';
import { useUsers } from '@/src/hooks/useUsers';
import { useEffect } from 'react';
import { Loading } from "@/src/components/Loading";

const Tab = createBottomTabNavigator<BottomTabParams>();

const ICON_MAP = {
    Home: { active: ICONS.home, inactive: ICONS.homeOutline },
    Search: { active: ICONS.search, inactive: ICONS.searchOutline },
    Map: { active: ICONS.map, inactive: ICONS.mapOutline },
    Profile: { active: ICONS.person, inactive: ICONS.personOutline },
} as const;

const renderTabIcon = (
    routeName: keyof BottomTabParams,
    focused: boolean,
    color: string,
    size: number
) => {
    const { active, inactive } = ICON_MAP[routeName];
    return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
};

export default function MainTabs() {
    const { user, loading, fetchUserById, loadStoredUser } = useUsers();

    useEffect(() => {
        const initializeUser = async () => {
            const storedUser = await loadStoredUser();
            if (storedUser?.id) {
                await fetchUserById(storedUser.id);
            }
        };
        initializeUser();
    }, []);

    if (loading || !user) {
        return <Loading />;
    }

    const ProfileComponent =
        user?.type === "sitter" ? SitterProfileScreen : OwnerProfileScreen;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) =>
                    renderTabIcon(route.name as keyof BottomTabParams, focused, color, size),
                tabBarActiveTintColor: Theme.COLORS.primary,
                tabBarInactiveTintColor: Theme.COLORS.textSecondary,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Profile" component={ProfileComponent} />
        </Tab.Navigator>
    );
}



// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import HomeScreen from '@/src/screens/HomeScreen';
// import SearchScreen from '@/src/screens/SearchScreen';
// import OwnerProfileScreen from '@/src/screens/Profile/OwnerProfileScreen';
// import SitterProfileScreen from '@/src/screens/Profile/SitterProfileScreen';
// import MapScreen from '@/src/screens/MapScreen';
// import { Theme } from '../theme/theme';
// import { ICONS } from "@/src/constants/icons";
// import { BottomTabParams } from '@/src/types/types';
// import { useUsers } from '@/src/hooks/useUsers';
// import { useEffect, useState } from 'react';
// import * as SecureStore from 'expo-secure-store';
// import {Loading} from "@/src/components/Loading";
//
// const Tab = createBottomTabNavigator<BottomTabParams>();
//
// const ICON_MAP = {
//     Home: { active: ICONS.home, inactive: ICONS.homeOutline },
//     Search: { active: ICONS.search, inactive: ICONS.searchOutline },
//     Map: { active: ICONS.map, inactive: ICONS.mapOutline },
//     Profile: { active: ICONS.person, inactive: ICONS.personOutline },
// } as const;
//
// const renderTabIcon = (routeName: keyof BottomTabParams, focused: boolean, color: string, size: number) => {
//     const { active, inactive } = ICON_MAP[routeName];
//     return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
// };
//
// export default function MainTabs() {
//     const { data: user, loading, getUserById } = useUsers();
//     const [isLoading, setIsLoading] = useState(true);
//
//     useEffect(() => {
//         const fetchUser = async () => {
//             const storedUser = await SecureStore.getItemAsync('user');
//             if (storedUser) {
//                 const parsed = JSON.parse(storedUser);
//                 const userId = parsed?.data?.id;
//                 if (userId) {
//                     await getUserById(userId);
//                 }
//             }
//             setIsLoading(false);
//         };
//         fetchUser();
//     }, []);
//
//     if (loading || isLoading || !user) {
//         return <Loading />;
//     }
//
//     console.log(user?.type);
//     const ProfileComponent = user?.type === 'sitter' ? SitterProfileScreen : OwnerProfileScreen;
//
//     return (
//         <Tab.Navigator
//             screenOptions={({ route }) => ({
//                 headerShown: false,
//                 tabBarIcon: ({ focused, color, size }) =>
//                     renderTabIcon(route.name as keyof BottomTabParams, focused, color, size),
//                 tabBarActiveTintColor: Theme.COLORS.primary,
//                 tabBarInactiveTintColor: Theme.COLORS.textSecondary,
//             })}
//         >
//             <Tab.Screen name="Home" component={HomeScreen} />
//             <Tab.Screen name="Search" component={SearchScreen} />
//             <Tab.Screen name="Map" component={MapScreen} />
//             <Tab.Screen name="Profile" component={ProfileComponent} />
//         </Tab.Navigator>
//     );
// }