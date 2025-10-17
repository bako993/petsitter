import React, {useEffect, useState} from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Theme } from "@/src/theme/theme";
import { ProfileHeader } from "@/src/components/Profile/ProfileHeader";
import ProfileCard from "@/src/components/Profile/ProfileCard";
import ProfileButton from "@/src/components/Profile/ProfileButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParams } from "@/src/types/types";
import { useAuth } from "@/src/hooks/useAuth";
import { useUsers } from '@/src/hooks/useUsers';
import {Loading} from "@/src/components/Loading";
import UserEditModal from "@/src/components/Profile/UserEditModal";

export default function OwnerProfileScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const { logout } = useAuth();
    const { user, fetchUserById, loadStoredUser } = useUsers();
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        (async () => {
            await loadStoredUser();
        })();
    }, [loadStoredUser]);

    const onRefresh = async () => {
        setRefreshing(true);
        if (user?.id) await fetchUserById(user.id);
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

    if (!user) return <Loading />;

    return (
        <ScreenWrapper
            style={{ backgroundColor: Theme.COLORS.background }}
            refreshing={refreshing}
            onRefresh={onRefresh}
        >
            <ProfileHeader
                name={user.name || "unknown"}
                email={user.email || "No email"}
            />
            <ProfileCard
                title="Saved Sitters"
                content="No saved sitters yet."
            />
            <ProfileButton
                text="Edit Personal Info"
                type="primary"
                onPress={() => setUserModalVisible(true)}
            />
            <ProfileButton
                text="Logout"
                type="secondary"
                onPress={handleLogout}
            />

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
