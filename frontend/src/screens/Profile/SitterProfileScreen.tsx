import React, {useState, useEffect, useCallback} from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Theme } from "@/src/theme/theme";
import { ProfileHeader } from "@/src/components/Profile/ProfileHeader";
import ProfileCard from "@/src/components/Profile/ProfileCard";
import ProfileButton from "@/src/components/Profile/ProfileButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParams } from "@/src/types/types";
import { useAuth } from "@/src/hooks/useAuth";
import { BASE_URL } from '@env';
import ProfileEditModal from "@/src/components/Profile/ProfileEditModal";
import UserEditModal from '@/src/components/UserEditModal'
import { useProfiles } from "@/src/hooks/useProfiles";
import * as SecureStore from "expo-secure-store";
import {Loading} from "@/src/components/Loading";
import { useUsers } from '@/src/hooks/useUsers';

export default function SitterProfileScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const { logout } = useAuth();
    const { getProfileById } = useProfiles();
    const { getUserById } = useUsers();

    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [userModalVisible, setUserModalVisible] = useState(false);


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


    const fetchProfile = useCallback(async () => {
        if (!user?.profile?.id) return;
        setLoadingProfile(true);

        try {
            const res = await getProfileById(user.profile.id);
            setProfile(res.data);
        } catch (err) {
            console.warn("Failed to fetch profile:", err);
        } finally {
            setLoadingProfile(false);
        }
    }, [user]);

    const fetchUser = useCallback(async () => {
        if (!user?.id) return

        try {
            console.log("Fetching latest user for id:", user?.id);
            const updatedUser = await getUserById(user.id);
            console.log("Fetched user:", updatedUser);
            setUser(updatedUser);
            await SecureStore.setItemAsync("user", JSON.stringify({ data: updatedUser }));
        } catch (err) {
            console.warn("Failed to fetch user:", err);
        }
    }, [user]);

    useEffect(() => {
        if (user) fetchProfile();
    }, [user, fetchProfile]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProfile();
        await fetchUser();
        setRefreshing(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigation.reset({ index: 0, routes: [{ name: "WelcomeScreen" }] });
        } catch (err) {
            console.warn("Logout failed", err);
        }
    };

    if (loadingProfile || !user) {
        return <Loading />;
    }

    const profilePhotoUri = profile?.profile_photo
        ? `${BASE_URL.replace(/\/api$/, '')}${profile.profile_photo}`
        : undefined;

    console.log("profile:: ", profile);


    return (
        <ScreenWrapper
            style={{ backgroundColor: Theme.COLORS.background }}
            refreshing={refreshing}
            onRefresh={onRefresh}
        >
            <ProfileHeader
                name={user.name || "unknown"}
                email={user.email || "No email"}
                profileImage={profilePhotoUri ? { uri: profilePhotoUri } : undefined}
            />
            <ProfileButton
                text="Edit Account"
                type="primary"
                onPress={() => setUserModalVisible(true)}
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
                    onProfileUpdated={async () => {
                        if (user?.profile?.id) await fetchProfile();
                    }}
                />
            )}
            {userModalVisible && (
                <UserEditModal
                    visible={userModalVisible}
                    userData={user}
                    onClose={() => setUserModalVisible(false)}
                    onUserUpdated={async () => {
                        if (user?.id) await fetchUser();
                    }}
                />
            )}
        </ScreenWrapper>
    );
}
