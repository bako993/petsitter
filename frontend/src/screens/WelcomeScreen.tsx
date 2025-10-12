import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParams } from "@/src/types/types";
import { Theme } from "@/src/theme/theme";
import Logo from "@/src/components/Logo";

export default function WelcomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();

    useEffect(() => {
        (async () => {
            const token = await SecureStore.getItemAsync("token");
            if (token) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "MainTabs" }],
                });
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Logo />

            <View style={styles.card}>
                <Text style={styles.title}>Welcome to PetSitting!</Text>
                <Text style={styles.subtitle}>
                    Connect with trusted pet sitters near you. Let’s take care of your
                    furry friends together!
                </Text>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: Theme.COLORS.primary }]}
                    onPress={() => navigation.navigate("LoginScreen")}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: Theme.COLORS.secondary, marginTop: 10 },
                    ]}
                    onPress={() => navigation.navigate("SignupScreen")}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] })}
                >
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    card: {
        width: "100%",
        backgroundColor: Theme.COLORS.cardSkyBlue,
        borderRadius: 20,
        padding: 25,
        shadowColor: Theme.COLORS.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        alignItems: "center",
        marginTop: 30,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        color: Theme.COLORS.text,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginVertical: 15,
        color: Theme.COLORS.textSecondary,
    },
    button: {
        width: "100%",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 17,
        fontWeight: "600",
    },
});
