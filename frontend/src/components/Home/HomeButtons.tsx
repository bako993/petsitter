import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParams } from "@/src/types/types";
import { useAuth } from "@/src/hooks/useAuth";
import { Theme } from "@/src/theme/theme";

export default function HomeButtons() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const { getLoggedInUser } = useAuth();

    if (getLoggedInUser.isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Theme.COLORS.primary} />
            </View>
        );
    }

    if (getLoggedInUser.isError) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>
                    {getLoggedInUser.error?.message || "Failed to load user info."}
                </Text>
            </View>
        );
    }

    const user = getLoggedInUser.data;

    const handleBecomeSitter = () => {
        if (!user) {
            navigation.navigate("LoginScreen");
            return;
        }
        if (user.type === "owner") {
            navigation.navigate("SitterOnboardingScreen");
            return;
        }
        navigation.navigate("MainTabs", { screen: "Profile" });
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
                    {user?.type === "owner" ? "Become a Sitter" : "Go to Profile"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: { padding: 20, alignItems: "center" },
    errorText: { color: "red", fontSize: 14 },
    buttonsContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
    searchButton: { flex: 1, marginRight: 10, padding: 15, backgroundColor: Theme.COLORS.primary, borderRadius: 8 },
    becomeButton: { flex: 1, marginLeft: 10, padding: 15, backgroundColor: Theme.COLORS.secondary, borderRadius: 8 },
    searchButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
    becomeButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});





// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { Theme } from '@/src/theme/theme';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { AppStackParams } from '@/src/types/types';
// import { auth } from "@/src/services/auth"
//
// export default function HomeButtons() {
//     const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
//     const [user, setUser] = useState<any | null>(null);
//
//     useEffect(() => {
//         (async () => {
//             const loggedUser = await auth.getLoggedInUser();
//             setUser(loggedUser);
//         })();
//     }, []);
//
//     const handleBecomeSitter = () => {
//         if (!user) {
//             navigation.navigate("LoginScreen");
//             return;
//         }
//
//         if (user.type === 'owner') {
//             navigation.navigate("SitterOnboardingScreen");
//             return;
//         }
//
//         navigation.navigate("MainTabs", { screen: "Profile" });
//     };
//
//     const handleFindSitter = () => {
//         navigation.navigate('MainTabs', { screen: 'Search' });
//     };
//
//     return (
//         <View style={styles.buttonsContainer}>
//             <TouchableOpacity style={styles.searchButton} onPress={handleFindSitter}>
//                 <Text style={styles.searchButtonText}>Find Sitter</Text>
//             </TouchableOpacity>
//
//             <TouchableOpacity style={styles.becomeButton} onPress={handleBecomeSitter}>
//                 <Text style={styles.becomeButtonText}>
//                     {user?.type === 'owner' ? "Become a Sitter" : "Go to Profile"}
//                 </Text>
//             </TouchableOpacity>
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     buttonsContainer: {
//         justifyContent: 'center',
//         width: '100%',
//         marginVertical: 60,
//     },
//     searchButton: {
//         backgroundColor: Theme.COLORS.secondary,
//         paddingVertical: 14,
//         paddingHorizontal: 30,
//         borderRadius: 10,
//         marginBottom: Theme.SPACING.section,
//         alignSelf: 'stretch',
//         ...Theme.SHADOWS.default,
//     },
//     searchButtonText: {
//         color: Theme.COLORS.background,
//         fontSize: Theme.FONTS.sizes.body,
//         fontWeight: Theme.FONTS.weights.bold,
//         textAlign: 'center',
//     },
//     becomeButton: {
//         backgroundColor: Theme.COLORS.background,
//         borderWidth: 1,
//         borderColor: Theme.COLORS.primary,
//         paddingVertical: 14,
//         paddingHorizontal: 30,
//         borderRadius: 10,
//         marginBottom: Theme.SPACING.section,
//         alignSelf: 'stretch',
//         ...Theme.SHADOWS.default,
//     },
//     becomeButtonText: {
//         color: Theme.COLORS.primary,
//         fontSize: Theme.FONTS.sizes.body,
//         fontWeight: Theme.FONTS.weights.bold,
//         textAlign: 'center',
//     },
// });
