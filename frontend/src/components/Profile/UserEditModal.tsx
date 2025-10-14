import React, { useState, useEffect } from "react";
import { TextInput, StyleSheet } from "react-native";
import { Theme } from "@/src/theme/theme";
import { useUsers } from "@/src/hooks/useUsers";
import BaseEditModal from "@/src/components/BaseEditModal";
import {input} from "sucrase/dist/types/parser/traverser/base";

type Props = {
    visible: boolean;
    userData: any;
    onClose: () => void;
    onUserUpdated?: () => Promise<void>;
};

export default function UserEditModal({ visible, userData, onClose, onUserUpdated }: Props) {
    const { updateUserById } = useUsers();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setName(userData?.name || "");
        setEmail(userData?.email || "");
    }, [userData]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateUserById(userData.id, {
                name: name !== userData.name ? name : undefined,
                email: email !== userData.email ? email : undefined,
            });
            await onUserUpdated?.();
            onClose();
        } catch (err) {
            console.warn("Failed to update user:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseEditModal
            visible={visible}
            title="Edit User Info"
            loading={loading}
            onClose={onClose}
            onSave={handleSave}
        >
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
});
