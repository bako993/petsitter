import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/src/theme/theme";

export default function EmptyState() {
    return (
        <View style={styles.container}>
            <Ionicons name="alert-circle-outline" size={40} color={Theme.COLORS.textSecondary} />
            <Text style={styles.text}>No sitters found</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
    text: { marginTop: 10, fontSize: Theme.FONTS.sizes.body, color: Theme.COLORS.textSecondary },
});
