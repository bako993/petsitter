import React from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import ProfileButton from "@/src/components/Profile/ProfileButton";
import { View, Text } from "react-native";
import { profileStyles as styles } from "@/src/theme/profileStyles";
import { Theme } from "@/src/theme/theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParams } from "@/src/types/types";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
    AppStackParams,
    "MainTabs"
>;

export default function NotLoggedInProfileScreen() {
    const navigation = useNavigation<ProfileScreenNavigationProp>();

    return (
        <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }} scrollable={false}>
            <View style={styles.center}>
                <Text style={styles.title}>Welcome to Petsitting!</Text>
                <Text style={styles.subtitle}>
                    Create an account or log in to manage your profile.
                </Text>

                <ProfileButton
                    text="Log In"
                    type="primary"
                    onPress={() => navigation.navigate("MainTabs", { screen: "Profile" })}
                />
                <ProfileButton
                    text="Sign Up"
                    type="secondary"
                    onPress={() => navigation.navigate("MainTabs", { screen: "Profile" })}
                />
            </View>
        </ScreenWrapper>
    );
}
