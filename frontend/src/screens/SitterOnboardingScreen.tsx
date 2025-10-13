import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Theme } from '@/src/theme/theme';
import ScreenWrapper from '@/src/components/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParams } from '@/src/types/types';
import { useAuth } from '@/src/hooks/useAuth';
import { profiles } from '@/src/services/profiles';

export default function SitterOnboardingScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const { refreshUser } = useAuth();

    const [bio, setBio] = useState('');
    const [experience, setExperience] = useState('');
    const [phone, setPhone] = useState('');
    const [availability, setAvailability] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'You need to grant photo access to continue.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets.length > 0) {
            setPhoto(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!bio || !experience || !phone || !availability) {
            Alert.alert('Missing fields', 'Please fill out all fields.');
            return;
        }

        setLoading(true);
        try {
            await profiles.create({ bio, experience, phone, availability, profilePhoto: photo });

            await refreshUser();

            Alert.alert('Success', 'Your sitter profile has been created!');
            navigation.navigate("MainTabs", { screen: "Profile" });
        } catch (err: any) {
            console.error(err);
            Alert.alert('Error', err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }}>
                <View style={styles.container}>
                    <Text style={styles.title}>Become a Sitter</Text>
                    <Text style={styles.subtitle}>Fill in your details to start receiving requests</Text>

                    <TouchableOpacity style={styles.photoPlaceholder} onPress={pickImage}>
                        {photo ? (
                            <Image source={{ uri: photo }} style={styles.photo} />
                        ) : (
                            <Text style={styles.photoText}>Add Photo</Text>
                        )}
                    </TouchableOpacity>

                    {renderInput('Bio', bio, setBio, 'Tell us about yourself')}
                    {renderInput('Experience', experience, setExperience, 'Your experience with pets')}
                    {renderInput('Phone', phone, setPhone, 'Your phone number', 'phone-pad')}
                    {renderInput('Availability', availability, setAvailability, 'e.g. Weekdays 9–5')}

                    <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="small" color={Theme.COLORS.background} />
                        ) : (
                            <Text style={styles.buttonText}>Submit</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScreenWrapper>
        </KeyboardAvoidingView>
    );
}

function renderInput(
    label: string,
    value: string,
    setValue: (val: string) => void,
    placeholder: string,
    keyboardType: any = 'default'
) {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={setValue}
                keyboardType={keyboardType}
                multiline={['Bio', 'Experience', 'Availability'].includes(label)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Theme.SPACING.page,
        paddingBottom: 40,
    },
    title: {
        fontSize: Theme.FONTS.sizes.title,
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.primary,
        marginBottom: Theme.SPACING.section,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
        marginBottom: Theme.SPACING.section,
        textAlign: 'center',
    },
    photoPlaceholder: {
        height: 120,
        width: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: Theme.COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: Theme.SPACING.section,
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    photoText: {
        color: Theme.COLORS.textSecondary,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: Theme.SPACING.section,
    },
    label: {
        color: Theme.COLORS.text,
        fontWeight: Theme.FONTS.weights.semiBold,
        marginBottom: Theme.SPACING.sm,
        fontSize: Theme.FONTS.sizes.small,
    },
    input: {
        backgroundColor: Theme.COLORS.card,
        borderRadius: 10,
        padding: Theme.SPACING.card,
        color: Theme.COLORS.text,
    },
    button: {
        backgroundColor: Theme.COLORS.primary,
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: Theme.SPACING.section,
        alignItems: 'center',
    },
    buttonText: {
        color: Theme.COLORS.background,
        fontSize: Theme.FONTS.sizes.body,
        fontWeight: Theme.FONTS.weights.bold,
    },
});
