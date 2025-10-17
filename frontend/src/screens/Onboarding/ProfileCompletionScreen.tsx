import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Theme } from '@/src/theme/theme';
import ScreenWrapper from '@/src/components/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParams } from '@/src/types/types';
import { FormInput } from '@/src/components/FormInput';
import { useUsers } from '@/src/hooks/useUsers';
import { useProfiles } from '@/src/hooks/useProfiles';
import { saveUserToStorage } from '@/src/utils/storage';
import PhotoPicker from '@/src/components/PhotoPicker';
import ProgressIndicator from '@/src/components/ProgressIndicator'

export default function ProfileCompletionScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const { user, updateUserById, setUser, loadStoredUser } = useUsers();
    const { createProfile } = useProfiles();

    const [bio, setBio] = useState('');
    const [experience, setExperience] = useState('');
    const [phone, setPhone] = useState('');
    const [availability, setAvailability] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            await loadStoredUser();
        })();
    }, [loadStoredUser]);

    const handleSubmit = async () => {
        if (!user) {
            return Alert.alert("Error", "User not loaded yet. Please try again.");
        }

        if (user?.profile) {
            return Alert.alert(
                "Profile already exists",
                "You already have a sitter profile and cannot create another one."
            );
        }
        if (!bio || !experience || !phone || !availability) {
            return Alert.alert('Missing fields', 'Please fill out all fields.');
        }

        setLoading(true);
        try {
            const createdProfile = await createProfile({
                bio,
                experience,
                phone,
                availability,
                profilePhoto: photo
            });

            if (user?.id) {
                const updatedUser = await updateUserById(user.id, {
                    type: 'sitter',
                    profile_id: createdProfile.id
                });

                setUser(updatedUser);
                await saveUserToStorage(updatedUser);
                navigation.navigate("OfferingCompletionScreen");
            }
        } catch (err: any) {
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
                <ProgressIndicator
                    currentStep={0}
                    steps={['Profile', 'Offering', 'Location']}
                />
                <View style={styles.container}>
                    <Text style={styles.title}>Become a Sitter</Text>
                    <Text style={styles.subtitle}>Fill in your details to start receiving requests</Text>

                    <PhotoPicker
                        imageUri={photo}
                        onImagePicked={setPhoto}
                        size={120}
                    />

                    <FormInput label="Bio" value={bio} onChange={setBio} placeholder="Tell us about yourself" />
                    <FormInput label="Experience" value={experience} onChange={setExperience} placeholder="Your experience with pets" />
                    <FormInput label="Phone" value={phone} onChange={setPhone} placeholder="Your phone number" keyboardType="phone-pad" />
                    <FormInput label="Availability" value={availability} onChange={setAvailability} placeholder="e.g. Weekdays 9–5" />
                    <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading || !user}>
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

const styles = StyleSheet.create({
    container: {
        padding: Theme.SPACING.page,
        paddingBottom: 40,
        flex: 1,
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
    photo: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    photoText: {
        color: Theme.COLORS.textSecondary,
        textAlign: 'center',
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