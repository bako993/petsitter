import React, { useState } from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import {Text, ActivityIndicator} from "react-native";
import { Theme } from "@/src/theme/theme";
import ProfileHeader from "@/src/components/Profile/ProfileHeader";
import ProfileCard from "@/src/components/Profile/ProfileCard";
import ProfileButton from "@/src/components/Profile/ProfileButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParams } from "@/src/types/types";
import { useAuth } from "@/src/hooks/useAuth";
import { BASE_URL } from '@env';
import ProfileEditModal from "@/src/components/Profile/ProfileEditModal";

export default function SitterProfileScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const { user, logout, loading, refreshUser } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);

    const profile = user?.data.profile;

    if (loading) {
        return (
            <ScreenWrapper style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Theme.COLORS.primary} />
                <Text>Loading profile...</Text>
            </ScreenWrapper>
        );
    }

    const handleLogout = async () => {
        try {
            await logout();
            navigation.reset({ index: 0, routes: [{ name: "WelcomeScreen" }] });
        } catch (err) {
            console.warn("Logout failed", err);
        }
    };

    const profilePhotoUri = profile?.profile_photo
        ? `${BASE_URL.replace(/\/api$/, '')}${profile.profile_photo}`
        : undefined;

    console.log('Rendering SitterProfileScreen, user:', user);
    return (
        <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }}>
            <ProfileHeader
                name={user?.data.name || "unknown"}
                email={user?.data.email || "No email"}
                profileImage={profilePhotoUri ? { uri: profilePhotoUri } : undefined}
            />

            <ProfileCard title="Bio" content={profile?.bio || "No bio yet"} />
            <ProfileCard title="Experience" content={profile?.experience || "No experience info"} />
            <ProfileCard title="Availability" content={profile?.availability || "No availability set"} />
            <ProfileCard title="Phone" content={profile?.phone || "No phone number"} />

            <ProfileButton text="Edit Profile" type="secondary" onPress={() => setModalVisible(true)} />
            <ProfileButton text="Logout" type="secondary" onPress={handleLogout} />

            {modalVisible && (
                <ProfileEditModal
                    visible={modalVisible}
                    profileData={profile}
                    onClose={() => setModalVisible(false)}
                    onSave={refreshUser}
                />
            )}
        </ScreenWrapper>
    );
}
