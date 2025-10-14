import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Theme } from '@/src/theme/theme';

type LoadingProps = {
    message?: string;
    style?: object;
};

export const Loading: React.FC<LoadingProps> = ({ message, style }) => {
    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size="large" color={Theme.COLORS.primary} />
            {message && <Text style={styles.text}>{message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 10,
        color: Theme.COLORS.text,
    },
});
