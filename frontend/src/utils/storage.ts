import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUserToStorage = async (user: any) => {
    try {
        await SecureStore.setItemAsync('user', JSON.stringify({ data: user }));
    } catch (error) {
        console.warn('Failed to save user to storage:', error);
    }
};

export const saveSittersToStorage = async (sitters: any[]) => {
    try {
        await AsyncStorage.setItem('sitters', JSON.stringify({ data: sitters }));
    } catch (error) {
        console.warn('Failed to save sitters to storage:', error);
    }
};

export const loadSittersFromStorage = async () => {
    try {
        const stored = await AsyncStorage.getItem('sitters');
        if (stored) {
            return JSON.parse(stored).data;
        }
        return null;
    } catch (error) {
        console.warn('Failed to load sitters from storage:', error);
        return null;
    }
};