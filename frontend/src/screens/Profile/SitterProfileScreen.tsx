import React, {useState, useEffect} from "react";
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
import {Loading} from "@/src/components/Loading";
import { useUsers } from '@/src/hooks/useUsers';

export default function SitterProfileScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const { logout } = useAuth();
    const { user, fetchUserById, loadStoredUser } = useUsers();
    const { profile, getProfileById, loading } = useProfiles();
    const [modalVisible, setModalVisible] = useState(false);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        loadStoredUser();
    }, []);

    useEffect(() => {
        if (user?.profile?.id) {
            getProfileById(user.profile.id);
        }
    }, [user]);

    const onRefresh = async () => {
        setRefreshing(true);
        if (user?.id) await fetchUserById(user.id);
        if (user?.profile?.id) await getProfileById(user.profile.id);
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

    if (loading || !user) return <Loading />;

    const profilePhotoUri = profile?.profile_photo
        ? `${BASE_URL.replace(/\/api$/, '')}${profile.profile_photo}`
        : undefined;

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
                        if (user?.profile?.id) await getProfileById(user.profile.id);
                    }}
                />
            )}
            {userModalVisible && (
                <UserEditModal
                    visible={userModalVisible}
                    userData={user}
                    onClose={() => setUserModalVisible(false)}
                    onUserUpdated={async () => {
                        if (user?.id) await fetchUserById(user.id);
                    }}
                />
            )}
        </ScreenWrapper>
    );
}
