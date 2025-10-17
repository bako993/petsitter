import React, { useEffect, useState, ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Theme } from '@/src/theme/theme';

type AuthGateProps = {
    children: (isLoggedIn: boolean) => ReactNode;
};

export default function AuthGate({ children }: AuthGateProps) {
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const token = await SecureStore.getItemAsync('user');
                setIsLoggedIn(!!token);
            } catch (err) {
                console.error('Error checking token', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Theme.COLORS.primary} />
            </View>
        );
    }

    return <>{children(isLoggedIn)}</>;
}