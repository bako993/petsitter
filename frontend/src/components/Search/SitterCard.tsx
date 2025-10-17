import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Theme } from "@/src/theme/theme";

type Sitter = {
    id: number;
    name: string;
    city: string;
    rating: number;
    reviews: number;
    image: any;
    services: string[];
};

type Props = {
    sitter: Sitter;
    onPress: () => void;
};

export default function SitterCard({ sitter, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={sitter.image} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name}>{sitter.name}</Text>
                <Text style={styles.city}>{sitter.city}</Text>
                <Text style={styles.rating}>{sitter.rating} ({sitter.reviews} reviews)</Text>
                <Text style={styles.services}>Services: {sitter.services.join(", ")}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: Theme.COLORS.card,
        borderRadius: 10,
        padding: 10,
        marginBottom: Theme.SPACING.section,
        alignItems: "center",
        ...Theme.SHADOWS.default,
    },
    image: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
    info: { flex: 1 },
    name: { fontSize: Theme.FONTS.sizes.subtitle, fontWeight: Theme.FONTS.weights.bold, color: Theme.COLORS.text },
    city: { fontSize: Theme.FONTS.sizes.body, color: Theme.COLORS.textSecondary },
    rating: { fontSize: Theme.FONTS.sizes.small, color: Theme.COLORS.textSecondary, marginTop: 2 },
    services: { fontSize: Theme.FONTS.sizes.small, color: Theme.COLORS.textSecondary, marginTop: 2, fontStyle: "italic" },
});
