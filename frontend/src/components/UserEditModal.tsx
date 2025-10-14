import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { Theme } from "@/src/theme/theme";
import { useUsers } from "@/src/hooks/useUsers";

type Props = {
    visible: boolean;
    userData: any;
    onClose: () => void;
    onUserUpdated?: () => Promise<void>;
};

export default function UserEditModal({ visible, userData, onClose, onUserUpdated }: Props) {
    const { updateUserById } = useUsers();
    const [name, setName] = useState(userData?.name || "");
    const [email, setEmail] = useState(userData?.email || "");
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

            if (onUserUpdated) await onUserUpdated();

            onClose();
        } catch (err) {
            console.warn("Failed to update user:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <View style={[styles.container, Theme.SHADOWS.default]}>
                        <Text style={styles.title}>Edit User Info</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancel]}
                                onPress={onClose}
                                disabled={loading}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.save]}
                                onPress={handleSave}
                                disabled={loading}
                            >
                                <Text style={styles.buttonText}>{loading ? "Saving..." : "Save"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    container: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 4,
    },
    cancel: {
        backgroundColor: "#ccc",
    },
    save: {
        backgroundColor: Theme.COLORS.primary,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
