import { StyleSheet } from "react-native";
import { Theme } from "@/src/theme/theme";

export const profileStyles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: Theme.SPACING.page,
    },
    title: {
        fontSize: Theme.FONTS.sizes.title,
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.primary,
        marginBottom: Theme.SPACING.section,
        textAlign: "center",
    },
    subtitle: {
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
        marginBottom: Theme.SPACING.section,
        textAlign: "center",
    },
    primaryButton: {
        backgroundColor: Theme.COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: Theme.SPACING.section,
        ...Theme.SHADOWS.default,
    },
    primaryButtonText: {
        color: Theme.COLORS.background,
        fontWeight: Theme.FONTS.weights.bold,
        fontSize: Theme.FONTS.sizes.body,
        textAlign: "center",
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: Theme.COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: Theme.SPACING.section,
        ...Theme.SHADOWS.default,
    },
    secondaryButtonText: {
        color: Theme.COLORS.primary,
        fontWeight: Theme.FONTS.weights.bold,
        fontSize: Theme.FONTS.sizes.body,
        textAlign: "center",
    },
    header: {
        alignItems: "center",
        marginBottom: Theme.SPACING.section,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
    },
    name: {
        fontSize: Theme.FONTS.sizes.title,
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.text,
    },
    email: {
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
        marginBottom: Theme.SPACING.section,
    },
    card: {
        backgroundColor: Theme.COLORS.card,
        padding: Theme.SPACING.card,
        borderRadius: 10,
        marginBottom: Theme.SPACING.section,
        ...Theme.SHADOWS.default,
    },
    cardTitle: {
        fontSize: Theme.FONTS.sizes.subtitle,
        fontWeight: Theme.FONTS.weights.semiBold,
        marginBottom: 4,
        color: Theme.COLORS.text,
    },
    cardContent: {
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
    },
});
