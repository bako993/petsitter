import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Theme } from '@/src/theme/theme';

export default function HomeHeader() {
    return (
        <View style={styles.header}>
            <Image
                source={require('@/assets/images/applogo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.appTitle}>Petsitting</Text>
            <Text style={styles.welcomeText}>Find Perfect Care for Your Pets</Text>
            <Text style={styles.tagline}>
                Connect with trusted, local pet sitters who will love and care for your pets like their own
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: Theme.SPACING.section,
    },
    logo: {
        width: 80,
        height: 80,
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
