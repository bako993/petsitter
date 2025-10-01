import React from 'react';
import { View, Text, Image } from 'react-native';
import { profileStyles as styles } from '@/src/theme/profileStyles';

type Props = {
    name: string;
    email: string;
    profileImage?: any;
};

export default function ProfileHeader({ name, email, profileImage }: Props) {
    return (
        <View style={styles.header}>
            {profileImage && <Image source={profileImage} style={styles.profileImage} />}
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
        </View>
    );
}
