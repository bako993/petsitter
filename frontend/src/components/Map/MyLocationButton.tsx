import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/src/theme/theme';

type Props = { onPress: () => void };

export default function MyLocationButton({ onPress }: Props) {
    return (
        <TouchableOpacity style={styles.myLocationButton} onPress={onPress}>
            <Ionicons name="locate" size={24} color={Theme.COLORS.background} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    myLocationButton: {
        position: 'absolute',
        bottom: Theme.SPACING.page,
        right: Theme.SPACING.page,
        backgroundColor: Theme.COLORS.primary,
        padding: 12,
        borderRadius: 50,
        elevation: 4,
        ...Theme.SHADOWS.default,
    },
});
