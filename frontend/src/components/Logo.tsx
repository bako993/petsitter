import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Theme } from '@/src/theme/theme';

export default function Logo() {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/applogo.png')}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.title}>Petsitting</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', marginBottom: Theme.SPACING.section * 2 },
    image: { width: 100, height: 100, marginBottom: 10 },
    title: { fontSize: Theme.FONTS.sizes.title, fontWeight: Theme.FONTS.weights.bold, color: Theme.COLORS.primary }
});
