import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Theme } from "@/src/theme/theme";

type Props = {
    services: string[];
    selectedService: string | null;
    setSelectedService: (service: string | null) => void;
};

export default function ServiceFilters({ services, selectedService, setSelectedService }: Props) {
    return (
        <View style={styles.container}>
            {services.map((service) => (
                <TouchableOpacity
                    key={service}
                    style={[
                        styles.button,
                        selectedService === service && styles.buttonSelected,
                    ]}
                    onPress={() =>
                        setSelectedService(selectedService === service ? null : service)
                    }
                >
                    <Text style={[styles.text, selectedService === service && styles.textSelected]}>
                        {service}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: "row", marginVertical: Theme.SPACING.section },
    button: {
        backgroundColor: Theme.COLORS.card,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 10,
    },
    buttonSelected: { backgroundColor: Theme.COLORS.primary },
    text: {
        color: Theme.COLORS.textSecondary,
        fontSize: Theme.FONTS.sizes.small,
    },
    textSelected: {
        color: Theme.COLORS.background,
        fontWeight: Theme.FONTS.weights.bold,
    },
});
