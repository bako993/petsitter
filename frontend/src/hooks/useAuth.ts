import { useState, useEffect, useCallback } from 'react';
import { auth } from '../services/auth';
import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'user';

export const useAuth = () => {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const { user: loggedUser, token: authToken } = await auth.login({ email, password });
            setUser(loggedUser);
            setToken(authToken);
            return loggedUser;
        } catch (err: any) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (params: { name: string; email: string; password: string; password_confirmation: string }) => {
        setLoading(true);
        setError(null);
        try {
            const { user: newUser, token: authToken } = await auth.signup(params);
            setUser(newUser);
            setToken(authToken);
            return newUser;
        } catch (err: any) {
            setError(err.message || 'Signup failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            await auth.logout();
            setUser(null);
            setToken(null);
        } catch (err: any) {
            setError(err.message || 'Logout failed');
        } finally {
            setLoading(false);
        }
    };

    const refreshUser = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const storedUserRaw  = await auth.getLoggedInUser();
            const storedUser = storedUserRaw?.data;
            const storedToken = await auth.getToken();

            if (!storedUser || !storedToken) {
                console.warn('Invalid stored user:', storedUser);
                setError('Invalid stored user ID');
                setUser(null);
                setToken(null);
                return;
            }

            const userId = Number(storedUser.id);
            if (isNaN(userId)) {
                console.warn('Stored user ID is not a valid number:', storedUser.id);
                setError('Invalid stored user ID');
                setUser(null);
                setToken(null);
                return;
            }

            const latestUser = await auth.fetchFullUser(userId);

            setUser(latestUser);
            setToken(storedToken);

            // Update storage with latest user
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(latestUser));
        } catch (err: any) {
            console.warn('refreshUser error:', err);
            setUser(null);
            setToken(null);
            setError(err.message || 'Failed to refresh user');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateStoredUser = async (newData: any) => {
        setUser(newData);
        await SecureStore.setItemAsync('user', JSON.stringify(newData));
    };

    useEffect(() => {
        (async () => {
            await refreshUser();
        })();
    }, []);

    return { user, token, loading, error, login, signup, logout, refreshUser, updateStoredUser };
};
