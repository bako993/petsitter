import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { Theme } from '@/src/theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParams } from '@/src/types/types';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/auth';
import Logo from '../components/Logo';

export default function LoginScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await auth.login({ email, password });
            console.log('Sending login request', { email, password });
            navigation.navigate('MainTabs', { screen: 'Home' });
        } catch (err: any) {
            const message = err?.message || 'Login failed';
            Alert.alert('Login failed', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                <Logo />
                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
                    <Text style={styles.linkText}>Create account</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: Theme.SPACING.page },
    label: { marginBottom: 5, color: Theme.COLORS.text, fontWeight: Theme.FONTS.weights.semiBold },
    input: {
        borderWidth: 1,
        borderColor: Theme.COLORS.card,
        borderRadius: 10,
        padding: 14,
        marginBottom: Theme.SPACING.section,
        fontSize: Theme.FONTS.sizes.body,
    },
    button: {
        backgroundColor: Theme.COLORS.primary,
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: Theme.SPACING.section,
        ...Theme.SHADOWS.default,
    },
    buttonText: {
        color: Theme.COLORS.background,
        fontSize: Theme.FONTS.sizes.body,
        fontWeight: Theme.FONTS.weights.bold,
    },
    linkText: {
        color: Theme.COLORS.primary,
        fontSize: Theme.FONTS.sizes.body,
        fontWeight: Theme.FONTS.weights.semiBold,
        textAlign: 'center',
        marginTop: Theme.SPACING.section,
    },
});
