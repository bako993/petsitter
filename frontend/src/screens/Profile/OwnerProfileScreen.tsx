import React from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Theme } from "@/src/theme/theme";
import ProfileHeader from "@/src/components/Profile/ProfileHeader";
import ProfileCard from "@/src/components/Profile/ProfileCard";
import ProfileButton from "@/src/components/Profile/ProfileButton";

type Props = {
    user: {
        id: number;
        type: "owner";
        name?: string;
        email?: string;
    };
};

export default function OwnerProfileScreen({ user }: Props) {
    return (
        <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }}>
            <ProfileHeader
                name={user.name || "Owner Name"}
                email={user.email || "owner@example.com"}
            />

            <ProfileCard title="Saved Sitters" content="No saved sitters yet." />

            <ProfileButton text="Edit Profile" type="primary" />
            <ProfileButton text="Logout" type="secondary" />
        </ScreenWrapper>
    );
}
