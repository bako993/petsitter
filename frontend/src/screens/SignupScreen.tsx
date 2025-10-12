import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { Theme } from '@/src/theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParams } from '@/src/types/types';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/auth';
import Logo from '../components/Logo';

export default function SignupScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        setLoading(true);
        try {
            const res = await auth.signup({ name, email, password, password_confirmation: passwordConfirm });
            navigation.navigate('MainTabs', { screen: 'Home' });
        } catch (err: any) {
            Alert.alert('Signup failed', err.message || 'Please try again');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                <Logo />
                <Text style={styles.label}>Name</Text>
                <TextInput placeholder="Enter your name" value={name} onChangeText={setName} style={styles.input} />

                <Text style={styles.label}>Email</Text>
                <TextInput placeholder="Enter your email" value={email} onChangeText={setEmail} autoCapitalize="none" style={styles.input} />

                <Text style={styles.label}>Password</Text>
                <TextInput placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

                <Text style={styles.label}>Confirm Password</Text>
                <TextInput placeholder="Confirm password" value={passwordConfirm} onChangeText={setPasswordConfirm} secureTextEntry style={styles.input} />

                <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.linkText}>Already have an account?</Text>
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
