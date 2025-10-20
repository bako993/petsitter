import React from 'react';
import { Marker } from 'react-native-maps';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParams } from '@/src/types/types';

type Props = {
  sitters: { id: number; name: string; latitude: number; longitude: number }[];
  navigation: NativeStackNavigationProp<AppStackParams>;
};

export const LocationMarkers = ({ sitters, navigation }: Props) => {
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
};
