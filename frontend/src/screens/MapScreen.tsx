import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParams } from '@/src/types/types';
import { COLORS, SPACING, SHADOWS} from '@/src/theme/theme';
import { Ionicons } from '@expo/vector-icons';

type MapScreenNavigationProp = NativeStackNavigationProp<AppStackParams, 'MainTabs'>;

export default function MapScreen() {
    const navigation = useNavigation<MapScreenNavigationProp>();
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef<MapView>(null);

    const sitters: { id: number; name: string; latitude: number; longitude: number }[] = [
        { id: 1, name: 'Alice', latitude: 51.9878, longitude: 5.8834 },
        { id: 2, name: 'Bob', latitude: 51.9880, longitude: 5.8840 },
        { id: 3, name: 'Charlie', latitude: 51.9875, longitude: 5.8852 },
        { id: 4, name: 'Daisy', latitude: 52.3676, longitude: 4.9041 },
    ];

    {/* Fetch user location */}
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.warn('Permission to access location was denied');
                setLoading(false);
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });
            setLoading(false);
        })();
    }, []);

    {/* Fit all sitters and user location on the map */}
    useEffect(() => {
        if (!loading && mapRef.current) {
            const coordinates: LatLng[] = [
                ...(location ? [location] : []),
                ...sitters.map((s) => ({ latitude: s.latitude, longitude: s.longitude })),
            ];

            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 120, right: 50, bottom: 120, left: 50 },
                animated: true,
            });
        }
    }, [loading, location]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const zoomToMyLocation = () => {
        if (mapRef.current && location) {
            mapRef.current.animateToRegion(
                {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                },
                1000
            );
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                showsUserLocation
            >
                {sitters.map((sitter) => (
                    <Marker
                        key={sitter.id}
                        coordinate={{ latitude: sitter.latitude, longitude: sitter.longitude }}
                        title={sitter.name}
                        onPress={() => navigation.navigate('SitterProfile', { sitterId: sitter.id })}
                    />
                ))}
            </MapView>
            <TouchableOpacity style={styles.myLocationButton} onPress={zoomToMyLocation}>
                <Ionicons name="locate" size={24} color={COLORS.background} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    map: {
        flex: 1,
    },
    myLocationButton: {
        position: 'absolute',
        bottom: SPACING.page,
        right: SPACING.page,
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 50,
        elevation: 4,
        ...SHADOWS.default
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
});
