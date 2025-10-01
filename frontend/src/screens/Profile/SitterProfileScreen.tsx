import React from "react";
import { Text } from "react-native";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Theme } from "@/src/theme/theme";
import ProfileHeader from "@/src/components/Profile/ProfileHeader";
import ProfileCard from "@/src/components/Profile/ProfileCard";
import ProfileButton from "@/src/components/Profile/ProfileButton";

type Props = {
    user: {
        id: number;
        type: "sitter";
        name?: string;
        email?: string;
        profileImage?: any;
        services?: string[];
        availability?: string[];
        reviews?: { rating: number; text: string }[];
    };
};

export default function SitterProfileScreen({ user }: Props) {
    return (
        <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }}>
            <ProfileHeader
                name={user.name || "Sitter Name"}
                email={user.email || "sitter@example.com"}
                profileImage={user.profileImage}
            />

            <ProfileCard title="Services Offered" content={user.services?.join(", ")} />
            <ProfileCard title="Availability" content={user.availability?.join(", ")} />
            <ProfileCard title="Reviews">
                {user.reviews?.map((r, idx) => (
                    <Text key={idx}>⭐ {r.rating} – {r.text}</Text>
                ))}
            </ProfileCard>

            <ProfileButton text="Edit Profile" type="primary" />
            <ProfileButton text="Logout" type="secondary" />
        </ScreenWrapper>
    );
}
