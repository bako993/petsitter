import React, { ReactNode } from "react";
import {
    Modal,
    View,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Theme } from "@/src/theme/theme";

type Props = {
    visible: boolean;
    title: string;
    loading?: boolean;
    onClose: () => void;
    onSave: () => Promise<void> | void;
    children: ReactNode;
};

export default function BaseEditModal({
                                          visible,
                                          title,
                                          loading,
                                          onClose,
                                          onSave,
                                          children,
                                      }: Props) {
    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <View style={[styles.container, Theme.SHADOWS.default]}>
                        <ScrollView keyboardShouldPersistTaps="handled">
                            <Text style={styles.title}>{title}</Text>

                            {children}

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
                                    onPress={onSave}
                                    disabled={loading}
                                >
                                    <Text style={styles.buttonText}>{loading ? "Saving..." : "Save"}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
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
        padding: 20,
    },
    container: {
        width: "100%",
        backgroundColor: Theme.COLORS.background,
        borderRadius: 16,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: Theme.COLORS.primary,
        textAlign: "center",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 4,
    },
    cancel: {
        backgroundColor: Theme.COLORS.shadow,
    },
    save: {
        backgroundColor: Theme.COLORS.primary,
    },
    buttonText: {
        color: Theme.COLORS.background,
        fontWeight: "600",
    },
});
