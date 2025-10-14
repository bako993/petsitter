import React from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Theme } from "@/src/theme/theme";
import { ProfileHeader } from "@/src/components/Profile/ProfileHeader";
import ProfileCard from "@/src/components/Profile/ProfileCard";
import ProfileButton from "@/src/components/Profile/ProfileButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParams } from "@/src/types/types";
import { useAuth } from "@/src/hooks/useAuth";

export default function OwnerProfileScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const { logout } = useAuth();

    const handleEdit = async () => {

    };

    const handleLogout = async () => {
        try {
            await logout();
            navigation.reset({ index: 0, routes: [{ name: "WelcomeScreen" }] });
        } catch (err) {
            console.warn("Logout failed", err);
        }
    };

    return (
        <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }}>
            <ProfileHeader name={"Unknown"} email={"No email"} />
            <ProfileCard title="Saved Sitters" content="No saved sitters yet." />
            <ProfileButton text="Edit Profile" type="primary" onPress={handleEdit} />
            <ProfileButton text="Logout" type="secondary" onPress={handleLogout} />
        </ScreenWrapper>
    );

    // return (
    //     <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }}>
    //         <ProfileHeader name={user?.data.name || "Unknown"} email={user?.data.email || "No email"} />
    //         <ProfileCard title="Saved Sitters" content="No saved sitters yet." />
    //         <ProfileButton text="Edit Profile" type="primary" onPress={handleEdit} />
    //         <ProfileButton text="Logout" type="secondary" onPress={handleLogout} />
    //     </ScreenWrapper>
    // );
}
