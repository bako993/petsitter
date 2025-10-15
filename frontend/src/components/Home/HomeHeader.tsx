import React, {use, useEffect} from "react";
import { View, Text, StyleSheet } from "react-native";
import Logo from "@/src/components/Logo";
import { Theme } from "@/src/theme/theme";
import { useUsers} from "@/src/hooks/useUsers";

export default function HomeHeader() {
    const { user, loadStoredUser } = useUsers();

    useEffect(() => {
        (async () => {
            await loadStoredUser();
        })();
    }, [loadStoredUser]);

    return (
        <View style={styles.header}>
            <Logo />
            <Text style={styles.welcomeText}>
                {"Welcome " + user?.name + "!"}
            </Text>

            <Text style={styles.tagline}>
                Connect with trusted, local pet sitters who will love and care for your pets like their own.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        padding: 20,
        alignItems: "center"
    },
    errorText: {
        color: Theme.COLORS.error,
        fontSize: Theme.FONTS.sizes.small
    },
    header: {
        alignItems: 'center',
        marginBottom: Theme.SPACING.section,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    profilePhoto: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    appTitle: {
        fontSize: Theme.FONTS.sizes.title,
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.primary,
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: Theme.FONTS.sizes.subtitle,
        fontWeight: Theme.FONTS.weights.semiBold,
        color: Theme.COLORS.text,
        marginBottom: 4,
    },
    tagline: {
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
        marginBottom: Theme.SPACING.section,
        textAlign: 'center',
    },
});
