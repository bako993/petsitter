import React, { useState, useEffect } from "react";
import {TextInput, StyleSheet, Text} from "react-native";
import BaseEditModal from "@/src/components/BaseEditModal";
import { Theme } from "@/src/theme/theme";
import { OFFERING_TYPES } from "@/src/constants/offering_types";
import AppDropdown from "@/src/components/AppDropdown";
import {Offering} from "@/src/types/types";

type Props = {
    visible: boolean;
    offering: any;
    onClose: () => void;
    onOfferingSaved?: (data: any) => void;
    existingOfferings?: Offering[];
};

export default function OfferingEditDetailModal({ visible, offering, onClose, onOfferingSaved, existingOfferings = [] }: Props) {
    const [form, setForm] = useState({
        offering_type: "",
        price: "",
        duration: "",
        conditions: "",
    });

    const [loading, setLoading] = useState(false);

    const usedTypes = existingOfferings
        ?.filter(o => o.id !== offering.id)
        .map(o => o.offering_type) || [];

    const availableOfferingTypes = OFFERING_TYPES.filter(type => !usedTypes.includes(type));

    useEffect(() => {
        if (offering) {
            setForm({
                offering_type: offering.offering_type || "",
                price: offering.price?.toString() || "",
                duration: offering.duration?.toString() || "",
                conditions: offering.conditions?.join(", ") || "",
            });
        }
    }, [offering]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const cleanedData = {
                ...form,
                price: parseFloat(form.price),
                duration: form.duration ? parseInt(form.duration, 10) : undefined,
                conditions: form.conditions ? form.conditions.split(",").map(c => c.trim()) : [],
            };

            onOfferingSaved?.(cleanedData);
            onClose();
        } catch (err) {
            console.warn("Failed to update offering:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseEditModal
            visible={visible}
            title="Edit Offering"
            loading={loading}
            onClose={onClose}
            onSave={handleSave}
        >
            <Text style={styles.label}>Offering Type</Text>
            <AppDropdown
                items={availableOfferingTypes.map(type => ({ label: type, value: type }))}
                value={form.offering_type}
                onChange={(val) => setForm(prev => ({ ...prev, offering_type: val }))}
                placeholder="Select Offering Type"
            />
            <Text style={styles.label}>Price</Text>
            <TextInput
                style={styles.input}
                placeholder="Price"
                value={form.price}
                onChangeText={text => setForm(prev => ({ ...prev, price: text }))}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Duration (minutes)</Text>
            <TextInput
                style={styles.input}
                placeholder="Duration"
                value={form.duration}
                onChangeText={text => setForm(prev => ({ ...prev, duration: text }))}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Conditions (comma separated)</Text>
            <TextInput
                style={styles.input}
                placeholder="Conditions"
                value={form.conditions}
                onChangeText={text => setForm(prev => ({ ...prev, conditions: text }))}
            />
        </BaseEditModal>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: Theme.COLORS.primary,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: Theme.COLORS.background,
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
    },
    label: {
        fontSize: Theme.FONTS.sizes.body,
        fontWeight: Theme.FONTS.weights.semiBold,
        color: Theme.COLORS.text,
        marginBottom: 4,
    },
});
