import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { profileStyles as styles } from '@/src/theme/profileStyles';

type Props = {
    text: string;
    onPress?: () => void;
    type?: 'primary' | 'secondary';
    disabled?: boolean;
};

export default function ProfileButton({ text, onPress, type = 'primary' }: Props) {
    const buttonStyle = type === 'primary' ? styles.primaryButton : styles.secondaryButton;
    const textStyle = type === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText;

    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress}>
            <Text style={textStyle}>{text}</Text>
        </TouchableOpacity>
    );
}
