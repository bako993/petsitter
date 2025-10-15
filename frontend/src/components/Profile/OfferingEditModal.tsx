import React from "react";
import {Text, FlatList, TouchableOpacity, StyleSheet, ScrollView} from "react-native";
import BaseEditModal from "@/src/components/BaseEditModal";
import { Theme } from "@/src/theme/theme";

type Props = {
    visible: boolean;
    offerings: any[];
    onClose: () => void;
    onSelectOffering: (offering: any) => void;
};

export default function OfferingEditModal({ visible, offerings, onClose, onSelectOffering }: Props) {
    return (
        <BaseEditModal
            visible={visible}
            title="Edit Offerings"
            onClose={onClose}
            onSave={onClose}
        >
            {offerings.length > 0 ? (
                <FlatList
                    data={offerings}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={true}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.offeringItem}
                            onPress={() => onSelectOffering(item)}
                        >
                            <Text style={styles.title}>{item.offering_type}</Text>
                            <Text style={styles.details}>
                                Price: ${item.price}
                                {item.duration ? ` / ${item.duration} min` : ""}
                                {"\n"}
                                {item.conditions?.join(", ")}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <Text style={styles.noOfferings}>No offerings to edit</Text>
            )}
        </BaseEditModal>
    );
}

const styles = StyleSheet.create({
    offeringItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: Theme.COLORS.primary,
    },
    title: {
        fontWeight: "bold",
        color: Theme.COLORS.text,
        fontSize: Theme.FONTS.sizes.subtitle,
    },
    details: {
        color: Theme.COLORS.textSecondary,
        fontSize: Theme.FONTS.sizes.body,
    },
    noOfferings: {
        textAlign: "center",
        marginTop: 20,
        color: Theme.COLORS.textSecondary,
    },
});
