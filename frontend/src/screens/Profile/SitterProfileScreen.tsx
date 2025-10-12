import React from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Theme } from "@/src/theme/theme";
import ProfileHeader from "@/src/components/Profile/ProfileHeader";
import ProfileCard from "@/src/components/Profile/ProfileCard";
import ProfileButton from "@/src/components/Profile/ProfileButton";
import { BASE_URL } from '@env';

type Props = {
    user: any;
    profile?: any;
};

export default function SitterProfileScreen({ user, profile }: Props) {
    return (
        <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }}>
            <ProfileHeader
                name={user.name}
                email={user.email}
                profileImage={
                    profile?.profile_photo
                        ? { uri: `${BASE_URL}${profile.profile_photo}` }
                        : undefined
                }
            />

            <ProfileCard title="Bio" content={profile?.bio || "No bio yet"} />
            <ProfileCard title="Experience" content={profile?.experience || "No experience info"} />
            <ProfileCard title="Availability" content={profile?.availability || "No availability set"} />
            <ProfileCard title="Phone" content={profile?.phone || "No phone number"} />

            <ProfileButton text="Edit Profile" type="primary" />
            <ProfileButton text="Logout" type="secondary" />
        </ScreenWrapper>
    );
}
