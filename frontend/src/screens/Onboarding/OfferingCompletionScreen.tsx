import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, Alert} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParams, Offering } from "@/src/types/types";
import { Theme } from "@/src/theme/theme";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { useOfferings } from "@/src/hooks/useOfferings";
import { useUsers } from "@/src/hooks/useUsers";
import OfferingCreateModal from "@/src/components/Profile/OfferingCreateModal";
import {saveUserToStorage} from "@/src/utils/storage";
import ProgressIndicator from '@/src/components/ProgressIndicator'
import SubmitButton from "@/src/components/Onboarding/SubmitButton";
import OfferingItem from "@/src/components/Onboarding/OfferingItem";
import AddOfferingButton from "@/src/components/Onboarding/AddOfferingButton";

export default function OfferingCompletionScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const { user, setUser, fetchUserById, loadStoredUser } = useUsers();
    const { data: offeringsData, setData: setOfferings, createOffering, deleteOffering } = useOfferings();

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => { (async () => { await loadStoredUser(); })(); }, [loadStoredUser]);

    useEffect(() => {
        (async () => {
            if (!user?.profile?.id) return;
            const updatedUser = await fetchUserById(user.id);
            if (updatedUser.profile?.offerings) {
                setOfferings(updatedUser.profile.offerings);
            }
        })();
    }, [user]);

    const handleAddOfferings = () => setModalVisible(true);

    const handleCreateOffering = async (data: any) => {
        if (!user?.id || !user?.profile?.id) return;

        try {
            await createOffering({ ...data, profile_id: user.profile.id });
            const updatedUser = await fetchUserById(user.id);
            setUser(updatedUser);
            await saveUserToStorage(updatedUser);

            if (updatedUser.profile?.offerings) {
                setOfferings(updatedUser.profile.offerings);
            }
        } catch (err) {
            console.warn("Failed to create offering:", err);
        } finally {
            setModalVisible(false);
        }
    };

    const handleDeleteOffering = async (offering: Offering) => {
        if (!user?.id) return;

        Alert.alert(
            "Delete Offering",
            `Are you sure you want to delete "${offering.offering_type}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: async () => {
                        try {
                            await deleteOffering(offering.id);
                            const updatedUser = await fetchUserById(user.id);
                            setUser(updatedUser);
                            await saveUserToStorage(updatedUser);

                            if (updatedUser.profile?.offerings) {
                                setOfferings(updatedUser.profile.offerings);
                            }
                        } catch (err) {
                            console.warn("Failed to delete offering:", err);
                        }
                    }
                }
            ]
        );
    };

    const handleNextScreen = () => {
        navigation.navigate("LocationCompletionScreen");
    };

    return (
        <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }}>
            <ProgressIndicator
                currentStep={1}
                steps={['Profile', 'Offering', 'Location']}
            />
            <View style={styles.container}>
                <Text style={styles.title}>Complete Your Sitter Profile</Text>
                <Text style={styles.subtitle}>
                    Add offerings now or you can skip and do it later.
                </Text>

                {offeringsData.length > 0 ? (
                    offeringsData.map((offering: Offering) => (
                        <OfferingItem key={offering.id} offering={offering} onDelete={handleDeleteOffering} />
                    ))
                ) : (
                    <Text style={styles.noOfferings}>No offerings yet</Text>
                )}

                <AddOfferingButton onPress={() => setModalVisible(true)} />

                <SubmitButton
                    onPress={handleNextScreen}
                    title={offeringsData.length > 0 ? "Continue" : "Skip for now"}
                />

                {offeringsData.length > 0 && (
                    <Text style={{ marginTop: 20, color: Theme.COLORS.primary, textAlign: "center" }}>
                        You’ve added offerings! You can now continue to complete your profile.
                    </Text>
                )}
            </View>

            {modalVisible && (
                <OfferingCreateModal
                    visible={modalVisible}
                    existingOfferings={offeringsData}
                    onClose={() => setModalVisible(false)}
                    onOfferingSaved={handleCreateOffering}
                />
            )}

        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: Theme.FONTS.sizes.title,
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.primary,
        textAlign: "center",
        marginBottom: Theme.SPACING.section,
    },
    subtitle: {
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
        textAlign: "center",
        marginBottom: Theme.SPACING.section,
    },
    noOfferings: {
        color: Theme.COLORS.textSecondary,
        textAlign: "center",
        marginVertical: Theme.SPACING.card,
    },
});