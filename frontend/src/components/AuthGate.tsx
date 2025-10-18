import React, { useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import {Loading} from "@/src/components/Loading";

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

    if (loading) return <Loading />;

    return <>{children(isLoggedIn)}</>;
}