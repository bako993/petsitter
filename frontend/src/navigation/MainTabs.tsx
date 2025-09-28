import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '@/src/screens/HomeScreen';
import SearchScreen from '@/src/screens/SearchScreen';
import ProfileScreen from '@/src/screens/ProfileScreen';
import MapScreen from '@/src/screens/MapScreen';
import { Theme } from '../theme/theme';
import { ICONS } from "@/src/constants/icons";
import { BottomTabParams } from '@/src/types/types';

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
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}