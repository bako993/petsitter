import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import OwnerProfileScreen from "@/src/screens/Profile/OwnerProfileScreen";
import SitterProfileScreen from "@/src/screens/Profile/SitterProfileScreen";
import { Theme } from "@/src/theme/theme";
import { auth } from "@/src/services/auth";
import { users } from "@/src/services/users";

export default function ProfileScreen() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        (async () => {
            try {
                const loggedUser = await auth.getLoggedInUser();
                if (!loggedUser) return;

                const userData = await users.getById(loggedUser.id);
                setUser(userData);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator color={Theme.COLORS.primary} size="large" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator color={Theme.COLORS.primary} size="large" />
            </View>
        );
    }

    return user.role === "sitter" ? (
        <SitterProfileScreen user={user} profile={user?.profile ?? {}} />
    ) : (
        <OwnerProfileScreen user={user} />
    );
}
