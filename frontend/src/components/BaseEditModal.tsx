import React, { ReactNode, useEffect, useRef } from "react";
import {
    Modal,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    KeyboardEvent,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    const shift = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const showSub = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
            (event: KeyboardEvent) => {
                Animated.timing(shift, {
                    toValue: -event.endCoordinates.height / 3, // push slightly, not whole screen
                    duration: 250,
                    useNativeDriver: true,
                }).start();
            }
        );

        const hideSub = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            () => {
                Animated.timing(shift, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            }
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, [shift]);

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <Animated.View
                        style={[
                            styles.animatedContainer,
                            { transform: [{ translateY: shift }] },
                        ]}
                    >
                        <SafeAreaView style={[styles.container, Theme.SHADOWS.default]}>
                            <Text style={styles.title}>{title}</Text>

                            <View style={{ flexGrow: 1 }}>{children}</View>

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
                                    <Text style={styles.buttonText}>
                                        {loading ? "Saving..." : "Save"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </Animated.View>
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
        backgroundColor: Theme.COLORS.overlayBackground,
        padding: 20,
    },
    animatedContainer: {
        width: "100%",
        justifyContent: "center",
    },
    container: {
        backgroundColor: Theme.COLORS.background,
        borderRadius: 16,
        padding: 20,
        width: "100%",
    },
    title: {
        fontSize: Theme.FONTS.sizes.subtitle,
        fontWeight: Theme.FONTS.weights.bold,
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
        backgroundColor: Theme.COLORS.secondary,
    },
    save: {
        backgroundColor: Theme.COLORS.primary,
    },
    buttonText: {
        color: Theme.COLORS.background,
        fontWeight: Theme.FONTS.weights.semiBold,
    },
});

// import React, { ReactNode } from "react";
// import {
//     Modal,
//     View,
//     TouchableWithoutFeedback,
//     Keyboard,
//     Text,
//     TouchableOpacity,
//     StyleSheet,
// } from "react-native";
// import { Theme } from "@/src/theme/theme";
//
// type Props = {
//     visible: boolean;
//     title: string;
//     loading?: boolean;
//     onClose: () => void;
//     onSave: () => Promise<void> | void;
//     children: ReactNode;
// };
//
// export default function BaseEditModal({
//                                           visible,
//                                           title,
//                                           loading,
//                                           onClose,
//                                           onSave,
//                                           children,
//                                       }: Props) {
//     return (
//         <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
//             <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//                 <View style={styles.overlay}>
//                     <View style={[styles.container, Theme.SHADOWS.default]}>
//                             <Text style={styles.title}>{title}</Text>
//
//                             {children}
//
//                             <View style={styles.buttonRow}>
//                                 <TouchableOpacity
//                                     style={[styles.button, styles.cancel]}
//                                     onPress={onClose}
//                                     disabled={loading}
//                                 >
//                                     <Text style={styles.buttonText}>Cancel</Text>
//                                 </TouchableOpacity>
//
//                                 <TouchableOpacity
//                                     style={[styles.button, styles.save]}
//                                     onPress={onSave}
//                                     disabled={loading}
//                                 >
//                                     <Text style={styles.buttonText}>{loading ? "Saving..." : "Save"}</Text>
//                                 </TouchableOpacity>
//                             </View>
//                     </View>
//                 </View>
//             </TouchableWithoutFeedback>
//         </Modal>
//     );
// }
//
// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: Theme.COLORS.overlayBackground,
//         padding: 20,
//     },
//     container: {
//         width: "100%",
//         backgroundColor: Theme.COLORS.background,
//         borderRadius: 16,
//         padding: 20,
//     },
//     title: {
//         fontSize: Theme.FONTS.sizes.subtitle,
//         fontWeight: Theme.FONTS.weights.bold,
//         marginBottom: 20,
//         color: Theme.COLORS.primary,
//         textAlign: "center",
//     },
//     buttonRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginTop: 24,
//     },
//     button: {
//         flex: 1,
//         padding: 12,
//         borderRadius: 10,
//         alignItems: "center",
//         marginHorizontal: 4,
//     },
//     cancel: {
//         backgroundColor: Theme.COLORS.secondary,
//     },
//     save: {
//         backgroundColor: Theme.COLORS.primary,
//     },
//     buttonText: {
//         color: Theme.COLORS.background,
//         fontWeight: Theme.FONTS.weights.semiBold,
//     },
// });
