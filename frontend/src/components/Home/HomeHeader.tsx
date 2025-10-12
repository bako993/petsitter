import React from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "@/src/hooks/useAuth";
import Logo from "@/src/components/Logo";
import { Theme } from "@/src/theme/theme";

export default function HomeHeader() {
    const { getLoggedInUser } = useAuth();

    // Loading state
    if (getLoggedInUser.isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Theme.COLORS.primary} />
            </View>
        );
    }

    // Error state
    if (getLoggedInUser.isError) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>
                    {getLoggedInUser.error?.message || "Failed to load user info."}
                </Text>
            </View>
        );
    }

    const user = getLoggedInUser.data;

    return (
        <View style={styles.header}>
            {user?.profile?.profile_photo ? (
                <Image
                    source={{ uri: user.profile.profile_photo }}
                    style={styles.profilePhoto}
                />
            ) : (
                <Logo />
            )}

            <Text style={styles.welcomeText}>
                {user ? `Welcome back, ${user.name}!` : "Welcome!"}
            </Text>

            <Text style={styles.tagline}>
                Connect with trusted, local pet sitters who will love and care for your pets like their own.
            </Text>
        </View>
    );
}


// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, StyleSheet } from 'react-native';
// import { Theme } from '@/src/theme/theme';
// import { auth } from '@/src/services/auth';
// import Logo from "@/src/components/Logo";
//
// export default function HomeHeader() {
//     const [user, setUser] = useState<any | null>(null);
//
//     useEffect(() => {
//         (async () => {
//             const loggedUser = await auth.getLoggedInUser();
//             setUser(loggedUser);
//         })();
//     }, []);
//
//     return (
//         <View style={styles.header}>
//             {user?.profile?.profile_photo ? (
//                 <Image
//                     source={{ uri: user.profile.profile_photo }}
//                     style={styles.profilePhoto}
//                 />
//             ) : (
//                 <Logo />
//             )}
//
//             <Text style={styles.welcomeText}>
//                 {user ? `Welcome back, ${user.name}!` : "Welcome!"}
//             </Text>
//
//             <Text style={styles.tagline}>
//                 Connect with trusted, local pet sitters who will love and care for your pets like their own
//             </Text>
//         </View>
//     );
// }

const styles = StyleSheet.create({
    loadingContainer: { padding: 20, alignItems: "center" },
    errorText: { color: "red", fontSize: 14 },
    header: { padding: 20, alignItems: "center" },
    profilePhoto: { width: 60, height: 60, borderRadius: 30, marginBottom: 10 },
    welcomeText: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
    tagline: { fontSize: 14, color: "#555", textAlign: "center" },
    // header: {
    //     alignItems: 'center',
    //     marginBottom: Theme.SPACING.section,
    // },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    // profilePhoto: {
    //     width: 80,
    //     height: 80,
    //     borderRadius: 40,
    //     marginBottom: 10,
    // },
    appTitle: {
        fontSize: Theme.FONTS.sizes.title,
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.primary,
        marginBottom: 8,
    },
    // welcomeText: {
    //     fontSize: Theme.FONTS.sizes.subtitle,
    //     fontWeight: Theme.FONTS.weights.semiBold,
    //     color: Theme.COLORS.text,
    //     marginBottom: 4,
    // },
    // tagline: {
    //     fontSize: Theme.FONTS.sizes.body,
    //     color: Theme.COLORS.textSecondary,
    //     marginBottom: Theme.SPACING.section,
    //     textAlign: 'center',
    // },
});
