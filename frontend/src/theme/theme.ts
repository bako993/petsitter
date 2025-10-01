import { Platform } from "react-native";

const COLORS = {
    background: "#FFFFFF",
    primary: "#3f85c2ff",
    secondary: "#f17b5aff",
    card: "#E6E8E6",
    text: "#3f85c2ff",
    textSecondary: "#7A7A7A",
    accent: "#f17b5aff",
} as const;

const FONTS = {
    sizes: {
        title: 28,
        subtitle: 22,
        body: 16,
        small: 14,
    },
    weights: {
        bold: "700",
        semiBold: "600",
        regular: "400",
    },
} as const;

const SPACING = {
    page: 20,
    section: 15,
    card: 15,
} as const;

const SHADOWS = {
    default: Platform.select({
        ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
        },
        android: {
            elevation: 3,
        },
    }),
} as const;

export const Theme = { COLORS, FONTS, SPACING, SHADOWS };