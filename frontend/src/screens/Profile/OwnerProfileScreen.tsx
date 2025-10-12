import React, { useState } from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Theme } from "@/src/theme/theme";
import ProfileHeader from "@/src/components/Profile/ProfileHeader";
import ProfileCard from "@/src/components/Profile/ProfileCard";
import ProfileButton from "@/src/components/Profile/ProfileButton";
import { auth } from '@/src/services/auth';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParams } from "@/src/types/types";

type Props = {
    user: {
        id: number;
        type: "owner";
        name?: string;
        email?: string;
    };
};

export default function OwnerProfileScreen({ user }: Props) {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await auth.logout();

            navigation.reset({
                index: 0,
                routes: [{ name: "WelcomeScreen" }],
            });
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }}>
            <ProfileHeader
                name={user.name || "Owner Name"}
                email={user.email || "owner@example.com"}
            />

            <ProfileCard title="Saved Sitters" content="No saved sitters yet." />

            <ProfileButton text="Edit Profile" type="primary" />
            <ProfileButton
                text={loading ? "Logging out..." : "Logout"}
                type="secondary"
                onPress={handleLogout}
                disabled={loading}
            />
        </ScreenWrapper>
    );
}