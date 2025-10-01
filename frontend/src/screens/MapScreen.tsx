import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import { Theme } from '@/src/theme/theme';
import MapMarkers from '@/src/components/Map/MapMarkers';
import MyLocationButton from '@/src/components/Map/MyLocationButton';

export default function MapScreen() {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef<MapView>(null);

    const sitters = [
        { id: 1, name: 'Alice', latitude: 51.9878, longitude: 5.8834 },
        { id: 2, name: 'Bob', latitude: 51.9880, longitude: 5.8840 },
        { id: 3, name: 'Charlie', latitude: 51.9875, longitude: 5.8852 },
        { id: 4, name: 'Daisy', latitude: 52.3676, longitude: 4.9041 },
    ];

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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Theme.COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView ref={mapRef} style={styles.map} showsUserLocation>
                <MapMarkers sitters={sitters} />
            </MapView>
            <MyLocationButton onPress={zoomToMyLocation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.COLORS.background },
    map: { flex: 1 },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.COLORS.background,
    },
});





// import React, { useState, useEffect, useRef } from 'react';
// import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
// import MapView, { Marker, LatLng } from 'react-native-maps';
// import * as Location from 'expo-location';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { AppStackParams } from '@/src/types/types';
// import { Theme} from '@/src/theme/theme';
// import { Ionicons } from '@expo/vector-icons';
//
// type MapScreenNavigationProp = NativeStackNavigationProp<AppStackParams>;
//
// export default function MapScreen() {
//     const navigation = useNavigation<MapScreenNavigationProp>();
//     const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
//     const [loading, setLoading] = useState(true);
//     const mapRef = useRef<MapView>(null);
//
//     const sitters: { id: number; name: string; latitude: number; longitude: number }[] = [
//         { id: 1, name: 'Alice', latitude: 51.9878, longitude: 5.8834 },
//         { id: 2, name: 'Bob', latitude: 51.9880, longitude: 5.8840 },
//         { id: 3, name: 'Charlie', latitude: 51.9875, longitude: 5.8852 },
//         { id: 4, name: 'Daisy', latitude: 52.3676, longitude: 4.9041 },
//     ];
//
//     {/* Fetch user location */}
//     useEffect(() => {
//         (async () => {
//             const { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== 'granted') {
//                 console.warn('Permission to access location was denied');
//                 setLoading(false);
//                 return;
//             }
//
//             const currentLocation = await Location.getCurrentPositionAsync({});
//             setLocation({
//                 latitude: currentLocation.coords.latitude,
//                 longitude: currentLocation.coords.longitude,
//             });
//             setLoading(false);
//         })();
//     }, []);
//
//     {/* Fit all sitters and user location on the map */}
//     useEffect(() => {
//         if (!loading && mapRef.current) {
//             const coordinates: LatLng[] = [
//                 ...(location ? [location] : []),
//                 ...sitters.map((s) => ({ latitude: s.latitude, longitude: s.longitude })),
//             ];
//
//             mapRef.current.fitToCoordinates(coordinates, {
//                 edgePadding: { top: 120, right: 50, bottom: 120, left: 50 },
//                 animated: true,
//             });
//         }
//     }, [loading, location]);
//
//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color={Theme.COLORS.primary} />
//             </View>
//         );
//     }
//
//     const zoomToMyLocation = () => {
//         if (mapRef.current && location) {
//             mapRef.current.animateToRegion(
//                 {
//                     latitude: location.latitude,
//                     longitude: location.longitude,
//                     latitudeDelta: 0.01,
//                     longitudeDelta: 0.01,
//                 },
//                 1000
//             );
//         }
//     };
//
//     return (
//         <View style={styles.container}>
//             <MapView
//                 ref={mapRef}
//                 style={styles.map}
//                 showsUserLocation
//             >
//                 {sitters.map((sitter) => (
//                     <Marker
//                         key={sitter.id}
//                         coordinate={{ latitude: sitter.latitude, longitude: sitter.longitude }}
//                         title={sitter.name}
//                         onPress={() => navigation.navigate('SitterScreen', { sitterId: sitter.id })}
//                     />
//                 ))}
//             </MapView>
//             <TouchableOpacity style={styles.myLocationButton} onPress={zoomToMyLocation}>
//                 <Ionicons name="locate" size={24} color={Theme.COLORS.background} />
//             </TouchableOpacity>
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: Theme.COLORS.background,
//     },
//     map: {
//         flex: 1,
//     },
//     myLocationButton: {
//         position: 'absolute',
//         bottom: Theme.SPACING.page,
//         right: Theme.SPACING.page,
//         backgroundColor: Theme.COLORS.primary,
//         padding: 12,
//         borderRadius: 50,
//         elevation: 4,
//         ...Theme.SHADOWS.default
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: Theme.COLORS.background,
//     },
// });
