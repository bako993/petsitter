import {jest} from '@jest/globals';
import {Alert} from 'react-native';

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native') as any;
    return {
        ...actualNav,
        useNavigation: () => ({ navigate: jest.fn() }),
    };
});

jest.mock('@expo/vector-icons', () => {
    return {
        Ionicons: 'Ionicons',
    };
});

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native') as Record<string, any>;
    return {
        ...actualNav,
        useNavigation: () => ({ navigate: jest.fn() }),
    };
});

jest.mock('@react-native-async-storage/async-storage', () => {
    return {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    };
});

jest.mock('expo-secure-store', () => ({
    setItemAsync: jest.fn(),
    getItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

jest.mock('expo-location', () => ({
    getCurrentPositionAsync: jest.fn(),
    requestForegroundPermissionsAsync: jest.fn(),
    watchPositionAsync: jest.fn(),
}));

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('react-native-reanimated-carousel', () => {
    return { __esModule: true, default: jest.fn(() => null) };
});

jest.mock('react-native-dropdown-picker', () => {
    return { __esModule: true, default: jest.fn(() => null) };
});
