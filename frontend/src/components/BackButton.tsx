import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '@/src/theme/theme';
import {ICONS} from "@/src/constants/icons";
import { BackButtonProps} from "@/src/types/types";

export default function BackButton({ color = Theme.COLORS.background, size = Theme.FONTS.sizes.subtitle }: BackButtonProps) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Ionicons name={ICONS.back} size={size} color={color} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 10,
    },
});
