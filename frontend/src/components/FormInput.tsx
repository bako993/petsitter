import React from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { Theme } from '@/src/theme/theme';

interface FormInputProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
}

export const FormInput: React.FC<FormInputProps> = ({
                                                        label,
                                                        value,
                                                        onChange,
                                                        placeholder = '',
                                                        keyboardType = 'default',
                                                    }) => {
    const multiline = ['Bio', 'Experience', 'Availability'].includes(label);

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChange}
                keyboardType={keyboardType}
                multiline={multiline}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: Theme.SPACING.section,
    },
    label: {
        color: Theme.COLORS.text,
        fontWeight: Theme.FONTS.weights.semiBold,
        marginBottom: Theme.SPACING.sm,
        fontSize: Theme.FONTS.sizes.small,
    },
    input: {
        backgroundColor: Theme.COLORS.card,
        borderRadius: 10,
        padding: Theme.SPACING.card,
        color: Theme.COLORS.text,
    },
});
