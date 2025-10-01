import React from "react";
import NotLoggedInProfileScreen from "@/src/screens/Profile/NotLoggedInProfileScreen";
import OwnerProfileScreen from "@/src/screens/Profile/OwnerProfileScreen";
import SitterProfileScreen from "@/src/screens/Profile/SitterProfileScreen";

export type OwnerUser = {
    id: number;
    type: "owner";
    name?: string;
    email?: string;
};

export type SitterUser = {
    id: number;
    type: "sitter";
    name?: string;
    email?: string;
    profileImage?: any;
    services?: string[];
    availability?: string[];
    reviews?: { rating: number; text: string }[];
};

export type User = OwnerUser | SitterUser | null;

// ---------- MOCK USERS ----------
export const mockUsers = {
    notLoggedIn: null as User,
    sitter: {
        id: 1,
        type: "sitter" as const,
        name: "Alice",
        email: "alice@example.com",
        profileImage: require("@/assets/images/slider/slider1.jpg"),
        services: ["Pet Sitting", "Dog Walking", "Grooming"],
        availability: ["Mon-Fri", "Weekends"],
        reviews: [
            { rating: 5, text: "Great sitter!" },
            { rating: 4, text: "Very reliable." },
        ],
    },
    owner: {
        id: 2,
        type: "owner" as const,
        name: "Bob",
        email: "bob@example.com",
    },
};

// ---------- PROFILE FACTORY ----------
const renderProfile = (user: User) => {
    if (!user) return <NotLoggedInProfileScreen />;
    if (user.type === "owner") return <OwnerProfileScreen user={user} />;
    if (user.type === "sitter") return <SitterProfileScreen user={user} />;
    return null;
};

// ---------- MAIN COMPONENT ----------
export default function ProfileScreen() {
    const user: User = mockUsers.owner;

    return renderProfile(user);
}
