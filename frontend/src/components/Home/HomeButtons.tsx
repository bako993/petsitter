import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParams } from "@/src/types/types";
import { Theme } from "@/src/theme/theme";

export default function HomeButtons() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();

    const handleBecomeSitter = () => {
        // navigation.navigate("LoginScreen");
        navigation.navigate("SitterOnboardingScreen");
        // navigation.navigate("MainTabs", { screen: "Profile" });

    };

    const handleFindSitter = () => {
        navigation.navigate("MainTabs", { screen: "Search" });
    };

    return (
        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.searchButton} onPress={handleFindSitter}>
                <Text style={styles.searchButtonText}>Find Sitter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.becomeButton} onPress={handleBecomeSitter}>
                <Text style={styles.becomeButtonText}>
                    Become a Sitter
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        padding: 20,
        alignItems: "center"
    },
    buttonsContainer: {
        justifyContent: 'center',
        width: '100%',
        marginVertical: 60,
    },
    errorText: {
        color: Theme.COLORS.error,
        fontSize: Theme.FONTS.sizes.small
    },
    searchButton: {
        backgroundColor: Theme.COLORS.secondary,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: Theme.SPACING.section,
        alignSelf: 'stretch',
        ...Theme.SHADOWS.default,
    },
    searchButtonText: {
        color: Theme.COLORS.background,
        fontSize: Theme.FONTS.sizes.body,
        fontWeight: Theme.FONTS.weights.bold,
        textAlign: 'center',
    },
    becomeButton: {
        backgroundColor: Theme.COLORS.background,
        borderWidth: 1,
        borderColor: Theme.COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: Theme.SPACING.section,
        alignSelf: 'stretch',
        ...Theme.SHADOWS.default,
    },
    becomeButtonText: {
        color: Theme.COLORS.primary,
        fontSize: Theme.FONTS.sizes.body,
        fontWeight: Theme.FONTS.weights.bold,
        textAlign: 'center',
    },
});
