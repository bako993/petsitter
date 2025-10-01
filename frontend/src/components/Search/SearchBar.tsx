import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/src/theme/theme";

type Props = {
    query: string;
    setQuery: (q: string) => void;
};

export default function SearchBar({ query, setQuery }: Props) {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color={Theme.COLORS.textSecondary} />
            <TextInput
                style={styles.input}
                placeholder="Search by sitter name or city"
                value={query}
                onChangeText={setQuery}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Theme.COLORS.card,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: Theme.SPACING.page,
        ...Theme.SHADOWS.default,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.text,
    },
});
