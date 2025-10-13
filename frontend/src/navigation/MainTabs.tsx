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
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const Tab = createBottomTabNavigator<BottomTabParams>();

const ICON_MAP = {
    Home: { active: ICONS.home, inactive: ICONS.homeOutline },
    Search: { active: ICONS.search, inactive: ICONS.searchOutline },
    Map: { active: ICONS.map, inactive: ICONS.mapOutline },
    Profile: { active: ICONS.person, inactive: ICONS.personOutline },
} as const;

const renderTabIcon = (routeName: keyof BottomTabParams, focused: boolean, color: string, size: number) => {
    const { active, inactive } = ICON_MAP[routeName];
    return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
};

export default function MainTabs() {
    const { data: user, loading, getUserById } = useUsers();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = await SecureStore.getItemAsync('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const userId = parsed?.data?.id;
                if (userId) {
                    await getUserById(userId);
                }
            }
            setIsLoading(false);
        };
        fetchUser();
    }, []);

    if (loading || isLoading || !user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Theme.COLORS.primary} />
            </View>
        );
    }

    console.log(user.data?.type);
    const ProfileComponent = user?.data.type === 'sitter' ? SitterProfileScreen : OwnerProfileScreen;

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