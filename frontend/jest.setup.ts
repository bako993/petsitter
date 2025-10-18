import { jest } from '@jest/globals';
import { Alert } from 'react-native';

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native') as any;
    return {
        ...actualNav,
        useNavigation: () => ({ navigate: jest.fn() }),
    };
});

// Mock Expo Vector Icons
jest.mock('@expo/vector-icons', () => {
    return {
        Ionicons: 'Ionicons',
    };
});

// Mock react-native-maps Marker
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native') as Record<string, any>;
    return {
        ...actualNav,
        useNavigation: () => ({ navigate: jest.fn() }),
    };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
    return {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    };
});

// Mock Expo SecureStore
jest.mock('expo-secure-store', () => ({
    setItemAsync: jest.fn(),
    getItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));




// import 'react-native-gesture-handler/jestSetup';
//
// // Mock SecureStore
// jest.mock('expo-secure-store', () => ({
//     setItemAsync: jest.fn(),
//     getItemAsync: jest.fn(),
//     deleteItemAsync: jest.fn(),
// }));
//
// // Mock AsyncStorage
// import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
// jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
//
// // Mock alerts
// import { Alert } from 'react-native';
// jest.spyOn(Alert, 'alert').mockImplementation(() => {});
//
// // Mock navigation
// jest.mock('@react-navigation/native', () => ({
//     useNavigation: () => ({ navigate: jest.fn() }),
// }));
