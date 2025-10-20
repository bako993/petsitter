import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { profileStyles as styles } from '@/src/theme/profileStyles';

export interface ProfileHeaderProps {
  name: string;
  email: string;
  profileImage?: ImageSourcePropType;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email, profileImage }) => {
  return (
    <View style={styles.header}>
      {profileImage && <Image source={profileImage} style={styles.profileImage} />}
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
};
