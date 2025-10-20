import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/src/theme/theme';
import { ICONS } from '@/src/constants/icons';

interface ReviewCardProps {
  userName?: string;
  rating: number;
  comment: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ userName, rating, comment }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.user}>{userName || 'Unknown User'}</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={ICONS.star}
            size={20}
            color={star <= rating ? Theme.COLORS.yellow : Theme.COLORS.textSecondary}
          />
        ))}
      </View>
    </View>
    <Text style={styles.comment}>{comment}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.COLORS.card,
    borderRadius: 16,
    padding: Theme.SPACING.sm,
    marginBottom: Theme.SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.SPACING.xs,
  },
  user: {
    fontWeight: Theme.FONTS.weights.bold,
    fontSize: Theme.FONTS.sizes.body,
    color: Theme.COLORS.text,
  },
  stars: { flexDirection: 'row' },
  comment: { fontSize: Theme.FONTS.sizes.body, color: Theme.COLORS.textSecondary },
});
