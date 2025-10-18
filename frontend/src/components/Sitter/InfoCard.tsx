import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Theme } from "@/src/theme/theme";

interface InfoCardProps {
    title: string;
    content: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, content }) => (
    <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: Theme.COLORS.card,
        padding: Theme.SPACING.section,
        borderRadius: 16,
        marginBottom: Theme.SPACING.section,
    },
    title: {
        fontWeight: Theme.FONTS.weights.bold,
        fontSize: Theme.FONTS.sizes.body,
        marginBottom: Theme.SPACING.xs,
        color: Theme.COLORS.text,
    },
    content: {
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
    },
});
