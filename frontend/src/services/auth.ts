import { api } from './api';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const auth = {
    login: async ({ email, password }: { email: string; password: string }) => {
        const res = await api('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (!res.token) throw new Error(getErrorMessage(res));

        await SecureStore.setItemAsync(TOKEN_KEY, res.token);
        const user = await auth.fetchFullUser(res.user?.id || res.id);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

        return { token: res.token, user };
    },

    signup: async (params: { name: string; email: string; password: string; password_confirmation: string }) => {
        const res = await api('/register', {
            method: 'POST',
            body: JSON.stringify(params),
        });

        if (!res.token) throw new Error(getErrorMessage(res));

        await SecureStore.setItemAsync(TOKEN_KEY, res.token);
        const user = await auth.fetchFullUser(res.user?.id || res.id);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

        return { token: res.token, user };
    },

    fetchFullUser: async (userId: number) => {
        return api(`/users/${userId}`);
    },

    logout: async () => {
        try {
            await api('/logout', { method: 'POST' });
        } catch (err) {
            console.warn('Logout failed', err);
        } finally {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(USER_KEY);
        }
    },

    getToken: async () => await SecureStore.getItemAsync(TOKEN_KEY),

};

const getErrorMessage = (res: any) => {
    if (!res) return 'Unknown error';
    if (res.message) return res.message;
    if (res.errors) return Object.values(res.errors).flat().join('\n');
    return 'An error occurred';
};