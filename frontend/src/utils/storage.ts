import * as SecureStore from 'expo-secure-store';

export const saveUserToStorage = async (user: any) => {
    try {
        await SecureStore.setItemAsync('user', JSON.stringify({ data: user }));
    } catch (error) {
        console.warn('Failed to save user to storage:', error);
    }
};
