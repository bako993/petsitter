import * as SecureStore from 'expo-secure-store';
import {api} from './api';

type LoginParams = { email: string; password: string };
type SignupParams = { name: string; email: string; password: string; password_confirmation: string };

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const auth = {
    login: async ({ email, password }: LoginParams) => {
        const res = await api('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (!res.token) throw new Error('Invalid response from server');

        await SecureStore.setItemAsync(TOKEN_KEY, res.token);
        const userObj = res.user ?? res;
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userObj));

        return res;
    },

    signup: async ({ name, email, password, password_confirmation }: SignupParams) => {
        const res = await api('/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, password_confirmation }),
        });

        if (!res.token) throw new Error('Invalid response from server');

        await SecureStore.setItemAsync(TOKEN_KEY, res.token);
        const userObj = res.user ?? res;
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userObj));

        return res;
    },

    logout: async () => {
        try {
            await api('/logout', { method: 'POST' });
        } catch (err) {
            console.log('Logout request failed', err);
        } finally {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(USER_KEY);
        }
    },

    getToken: async () => {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    },

    getLoggedInUser: async () => {
        const userString = await SecureStore.getItemAsync(USER_KEY);
        if (!userString) return null;
        try {
            return JSON.parse(userString);
        } catch (err) {
            console.warn("Failed to parse stored user", err);
            return null;
        }
    },
};
