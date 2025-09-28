import React from "react";
// import NotLoggedInProfile from "../screens/profiles/NotLoggedInProfile";
// import OwnerProfile from "../screens/profiles/OwnerProfile";
// import SitterProfile from "../screens/profiles/SitterProfile";

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

export type User = OwnerUser | SitterUser;

const mockUserNotLoggedIn: User | null = null;

const mockUser: User | null = {
    id: 1,
    type: "sitter",
    name: "Alice",
    email: "alice@example.com",
    profileImage: require("@/assets/slider/slider1.jpg"),
    services: ["Pet Sitting", "Dog Walking", "Grooming"],
    availability: ["Mon-Fri", "Weekends"],
    reviews: [
        { rating: 5, text: "Great sitter!" },
        { rating: 4, text: "Very reliable." },
    ],
};

const mockUserOwner: User = {
    id: 2,
    type: "owner",
    name: "Bob",
    email: "bob@example.com",
};


export default function ProfileScreen() {
    const user = mockUserNotLoggedIn;

    // if (!user) return <NotLoggedInProfile />;
    // if (user.type === "owner") return <OwnerProfile user={user} />;
    //
    // return <SitterProfile user={user} />;
}