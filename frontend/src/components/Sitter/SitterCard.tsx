import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/src/theme/theme';
import { ICONS } from '@/src/constants/icons';

interface SitterCardProps {
  profile: any;
  fullPhotoUri?: string;
  averageRating: string;
}

export const SitterCard: React.FC<SitterCardProps> = ({ profile, fullPhotoUri, averageRating }) => {
  return (
    <View style={styles.card}>
      <Image
        source={fullPhotoUri ? { uri: fullPhotoUri } : require('@/assets/images/avatar.jpg')}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{profile?.user?.name || 'Unknown'}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name={ICONS.star} size={20} color={Theme.COLORS.yellow} />
        <Text style={styles.averageRating}>{averageRating}</Text>
        <Text style={styles.reviewCount}>({profile.reviews?.length || 0} reviews)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginBottom: Theme.SPACING.page,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: Theme.SPACING.sm,
  },
  name: {
    fontSize: Theme.FONTS.sizes.title,
    fontWeight: Theme.FONTS.weights.bold,
    color: Theme.COLORS.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.SPACING.xs,
  },
  averageRating: {
    fontWeight: Theme.FONTS.weights.bold,
    marginLeft: 6,
    color: Theme.COLORS.yellow,
  },
  reviewCount: {
    marginLeft: 6,
    color: Theme.COLORS.textSecondary,
  },
});
