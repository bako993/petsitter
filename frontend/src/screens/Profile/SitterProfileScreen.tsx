import React, { useState, useEffect } from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Text, ActivityIndicator } from "react-native";
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
import { useProfiles } from "@/src/hooks/useProfiles";
import * as SecureStore from "expo-secure-store";

export default function SitterProfileScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const { logout } = useAuth();
    const { getProfileById } = useProfiles();

    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await SecureStore.getItemAsync("user");
            console.log("storedUser:", storedUser);
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                setUser(parsed.data);
            }
        };
        loadUser();
    }, []);


    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.profile?.id) return;
            console.log("Fetching profile for user:", user?.profile.id); // ✅ debug
            setLoadingProfile(true);

            try {
                const res = await getProfileById(user?.profile?.id);
                console.log("Profile fetched in component:", res);
                setProfile(res.data);
            } catch (err) {
                console.warn("Failed to fetch profile:", err);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, [user]);



    const handleLogout = async () => {
        try {
            await logout();
            navigation.reset({ index: 0, routes: [{ name: "WelcomeScreen" }] });
        } catch (err) {
            console.warn("Logout failed", err);
        }
    };

    if (loadingProfile || !user) {
        return (
            <ScreenWrapper style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Theme.COLORS.primary} />
                <Text>Loading profile2222...</Text>
            </ScreenWrapper>
        );
    }

    const profilePhotoUri = profile?.profile_photo
        ? `${BASE_URL.replace(/\/api$/, '')}${profile.profile_photo}`
        : undefined;

    console.log("profile:: ", profile);


    return (
        <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }}>
            <ProfileHeader
                name={user.name || "unknown"}
                email={user.email || "No email"}
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
                    onProfileUpdated={() => getProfileById(user.id).then(p => setProfile(p.profile || {}))}
                />
            )}
        </ScreenWrapper>
    );
}
