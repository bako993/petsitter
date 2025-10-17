import React, { useState } from 'react';
import {
    TextInput,
    TouchableOpacity,
    Text,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { authStyles as styles } from "@/src/theme/authStyles";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParams } from '@/src/types/types';
import Logo from '../../components/Logo';
import { useAuth } from '@/src/hooks/useAuth';

export default function SignupScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const { signup, loading } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const handleSignup = async () => {
        if (!name || !email || !password || !passwordConfirm) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== passwordConfirm) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            await signup({
                name: name.trim(),
                email: email.trim(),
                password: password.trim(),
                password_confirmation: passwordConfirm.trim(),
            });
            navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        } catch (err: any) {
            Alert.alert('Signup failed', err.message || 'Something went wrong');
        }
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <Logo />

                <Text style={styles.label}>Name</Text>
                <TextInput
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />

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

                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    placeholder="Confirm password"
                    value={passwordConfirm}
                    onChangeText={setPasswordConfirm}
                    secureTextEntry
                    style={styles.input}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignup}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.linkText}>Already have an account?</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}
