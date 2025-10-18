import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
} from "react-native";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParams } from "@/src/types/types";
import { Theme } from "@/src/theme/theme";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { useUsers } from "@/src/hooks/useUsers";
import { useLocations } from "@/src/hooks/useLocations";
import ProgressIndicator from '@/src/components/ProgressIndicator'
import SubmitButton from "@/src/components/Onboarding/SubmitButton";
import LocationButton from "@/src/components/Onboarding/LocationButton";
import LocationForm from "@/src/components/Onboarding/LocationForm";

export default function LocationCompletionScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const { user, loadStoredUser } = useUsers();
    const { getLocations, createLocation, updateLocation } = useLocations();

    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [street, setStreet] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { (async () => { await loadStoredUser(); })(); }, [loadStoredUser]);

    const requestLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission denied", "You need to grant location permission to continue.");
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});
            setCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
            Alert.alert("Location set!", "We’ve captured your location successfully.");
        } catch (err) {
            console.warn("Error fetching location:", err);
            Alert.alert("Error", "Unable to get your location. Try again later.");
        }
    };

    const handleSaveLocation = async () => {
        if (!user || !user.id) {
            Alert.alert("Error", "User not found. Please wait a moment and try again.");
            return;
        }

        if (!coords) {
            Alert.alert("Missing location", "Please share your location before continuing.");
            return;
        }

        setLoading(true);
        try {
            const allLocations = await getLocations();
            const existing = allLocations.find((loc: any) => loc.user && loc.user.id === user.id);

            if (existing) {
                const payload: any = {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                };
                if (city) payload.city = city;
                if (postalCode) payload.postal_code = postalCode;
                if (street) payload.street = street;
                if (houseNumber) payload.house_number = houseNumber;

                await updateLocation(existing.id, payload);
                Alert.alert("Updated!", "Your location has been updated successfully.");
            } else {
                const payload = {
                    user_id: user.id,
                    city: city || null,
                    postal_code: postalCode || null,
                    street: street || null,
                    house_number: houseNumber || null,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                };
                await createLocation(payload);
                Alert.alert("Saved!", "Your location has been saved successfully.");
            }

            navigation.navigate("MainTabs", { screen: "Profile" });
        } catch (err) {
            console.warn("Failed to save location:", err);
            Alert.alert("Error", "Something went wrong while saving your location.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }}>
            <ProgressIndicator
                currentStep={3}
                steps={['Profile', 'Offering', 'Location']}
            />
            <View style={styles.container}>
                <Text style={styles.title}>Set Your Location</Text>
                <Text style={styles.subtitle}>
                    Share your location so nearby pet owners can find you.
                </Text>

                <LocationButton coordsCaptured={!!coords} onPress={requestLocation} />

                <LocationForm
                    city={city}
                    postalCode={postalCode}
                    street={street}
                    houseNumber={houseNumber}
                    setCity={setCity}
                    setPostalCode={setPostalCode}
                    setStreet={setStreet}
                    setHouseNumber={setHouseNumber}
                />

                <SubmitButton
                    onPress={handleSaveLocation}
                    loading={loading}
                    disabled={!coords}
                    title={"Submit"}
                />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Theme.SPACING.page,
        justifyContent: "center",
    },
    title: {
        fontSize: Theme.FONTS.sizes.title,
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.text,
        textAlign: "center",
        marginBottom: Theme.SPACING.sm,
    },
    subtitle: {
        fontSize: Theme.FONTS.sizes.small,
        color: Theme.COLORS.textSecondary,
        textAlign: "center",
        marginBottom: Theme.SPACING.section,
    },
});
