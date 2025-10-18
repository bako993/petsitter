import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import { Theme } from '@/src/theme/theme';
import MyLocationButton from '@/src/components/Map/MyLocationButton';
import { useProfiles } from '@/src/hooks/useProfiles';
import { useLocations } from '@/src/hooks/useLocations';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParams } from '@/src/types/types';
import {Loading} from "@/src/components/Loading";
import {LocationMarkers} from "@/src/components/Map/LocationMarkers";

type Navigation = NativeStackNavigationProp<AppStackParams>;

export default function MapScreen() {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [sitters, setSitters] = useState<any[]>([]);
    const mapRef = useRef<MapView>(null);

    const { getProfiles } = useProfiles();
    const { getLocations } = useLocations();
    const navigation = useNavigation<Navigation>();

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
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const profiles = await getProfiles();
                const allLocations = await getLocations();

                const sitterList = profiles
                    .map((p: any) => {
                        const loc = allLocations.find((l: any) => l.user?.id === p.user_id);
                        if (!loc || !loc.latitude || !loc.longitude) return null;
                        return {
                            id: p.id,
                            name: p.user?.name || 'Unnamed sitter',
                            latitude: loc.latitude,
                            longitude: loc.longitude,
                        };
                    })
                    .filter(Boolean);

                setSitters(sitterList);
            } catch (err) {
                console.error('Error fetching sitters or locations:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (!loading && mapRef.current && (location || sitters.length > 0)) {
            const coordinates: LatLng[] = [
                ...(location ? [location] : []),
                ...sitters.map((s) => ({ latitude: s.latitude, longitude: s.longitude })),
            ];

            if (coordinates.length > 0) {
                mapRef.current.fitToCoordinates(coordinates, {
                    edgePadding: { top: 120, right: 50, bottom: 120, left: 50 },
                    animated: true,
                });
            }
        }
    }, [loading, location, sitters]);

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

    if (loading) return <Loading />

    return (
        <View style={styles.container}>
            <MapView ref={mapRef} style={styles.map} showsUserLocation>
                <LocationMarkers sitters={sitters} navigation={navigation} />
            </MapView>
            <MyLocationButton onPress={zoomToMyLocation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.COLORS.background
    },
    map: {
        flex: 1
    },
});
