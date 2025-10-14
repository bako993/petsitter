import React, { useState, useEffect } from "react";
import { TextInput, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import BaseEditModal from "@/src/components/BaseEditModal";
import { Theme } from "@/src/theme/theme";
import { useProfiles } from "@/src/hooks/useProfiles";
import avatar from "@/assets/images/avatar.jpg";

type Props = {
    visible: boolean;
    onClose: () => void;
    profileData: any;
    onProfileUpdated?: () => Promise<void>;
};

export default function ProfileEditModal({ visible, onClose, profileData, onProfileUpdated }: Props) {
    const { updateProfile } = useProfiles();
    const [form, setForm] = useState({
        bio: "",
        experience: "",
        phone: "",
        availability: "",
        profilePhoto: null as string | null,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm({
            bio: profileData?.bio || "",
            experience: profileData?.experience || "",
            phone: profileData?.phone || "",
            availability: profileData?.availability || "",
            profilePhoto: profileData?.profile_photo || null,
        });
    }, [profileData]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets?.[0].uri) {
            setForm((prev) => ({ ...prev, profilePhoto: result.assets[0].uri }));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateProfile(profileData.id, form);
            await onProfileUpdated?.();
            onClose();
        } catch (err) {
            console.warn("Error updating profile:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseEditModal
            visible={visible}
            title="Edit Profile"
            loading={loading}
            onClose={onClose}
            onSave={handleSave}
        >
            <TouchableOpacity onPress={pickImage}>
                <Image
                    source={form.profilePhoto ? { uri: form.profilePhoto } : avatar}
                    style={styles.image}
                />
                <Text style={styles.changePhoto}>Change Photo</Text>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Bio"
                value={form.bio}
                onChangeText={(text) => setForm((p) => ({ ...p, bio: text }))}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Experience"
                value={form.experience}
                onChangeText={(text) => setForm((p) => ({ ...p, experience: text }))}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                value={form.phone}
                onChangeText={(text) => setForm((p) => ({ ...p, phone: text }))}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Availability"
                value={form.availability}
                onChangeText={(text) => setForm((p) => ({ ...p, availability: text }))}
            />
        </BaseEditModal>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: Theme.COLORS.primary,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: Theme.COLORS.background,
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 5,
        borderWidth: 2,
        borderColor: Theme.COLORS.primary,
    },
    changePhoto: {
        textAlign: 'center',
        color: Theme.COLORS.primary,
        fontWeight: Theme.FONTS.weights.semiBold,
        marginBottom: 15,
    },
});

