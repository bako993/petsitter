import React from 'react';
import { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParams } from '@/src/types/types';

type Props = {
    sitters: { id: number; name: string; latitude: number; longitude: number }[];
};

type Navigation = NativeStackNavigationProp<AppStackParams>;

export default function MapMarkers({ sitters }: Props) {
    const navigation = useNavigation<Navigation>();

    return (
        <>
            {sitters.map((sitter) => (
                <Marker
                    key={sitter.id}
                    coordinate={{ latitude: sitter.latitude, longitude: sitter.longitude }}
                    title={sitter.name}
                    onPress={() => navigation.navigate('SitterScreen', { sitterId: sitter.id })}
                />
            ))}
        </>
    );
}
