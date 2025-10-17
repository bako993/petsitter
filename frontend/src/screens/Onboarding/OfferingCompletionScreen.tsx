import React, { useState, useEffect } from "react";
import {View, Text, TouchableOpacity, StyleSheet, Alert} from "react-native";
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
                        <View
                            key={offering.id}
                            style={styles.offeringItem}
                        >
                            <Text style={styles.offeringTitle}>{offering.offering_type}</Text>
                            <Text style={styles.offeringDetails}>
                                Price: ${offering.price}{offering.duration ? ` / ${offering.duration} min` : ""}
                            </Text>
                            <TouchableOpacity onPress={() => handleDeleteOffering(offering)}>
                                <Text style={styles.deleteText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noOfferings}>No offerings yet</Text>
                )}


                <TouchableOpacity style={styles.addButton} onPress={handleAddOfferings}>
                    <Text style={styles.addButtonText}>Add Offerings</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleNextScreen}
                >
                    <Text style={styles.skipButtonText}>
                        {offeringsData.length > 0 ? "Continue" : "Skip for now"}
                    </Text>
                </TouchableOpacity>


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
    headerContainer: {
        padding: Theme.SPACING.page,
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
    offeringsList: {
        marginVertical: Theme.SPACING.section,
        maxHeight: 300,
    },
    offeringItem: {
        padding: Theme.SPACING.card,
        borderWidth: 1,
        borderColor: Theme.COLORS.primary,
        borderRadius: 10,
        marginBottom: Theme.SPACING.card,
        marginHorizontal: Theme.SPACING.page,
    },
    offeringTitle: {
        fontWeight: "bold",
    },
    offeringDetails: {
        color: Theme.COLORS.textSecondary,
    },
    noOfferings: {
        color: Theme.COLORS.textSecondary,
        textAlign: "center",
        marginVertical: Theme.SPACING.card,
    },
    addButton: {
        backgroundColor: Theme.COLORS.primary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: Theme.SPACING.card,
    },
    addButtonText: {
        color: Theme.COLORS.background,
        fontWeight: "bold",
    },
    skipButton: {
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: Theme.COLORS.primary,
        marginBottom: Theme.SPACING.section,
    },
    skipButtonText: {
        color: Theme.COLORS.primary,
        fontWeight: "bold",
    },
    deleteText: {
        color: Theme.COLORS.error,
        marginTop: 5,
    },
});