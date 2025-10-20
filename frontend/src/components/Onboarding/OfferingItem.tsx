import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '@/src/theme/theme';
import { Offering } from '@/src/types/types';

interface OfferingItemProps {
  offering: Offering;
  onDelete: (offering: Offering) => void;
}

export default function OfferingItem({ offering, onDelete }: OfferingItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{offering.offering_type}</Text>
      <Text style={styles.details}>
        Price: ${offering.price}
        {offering.duration ? ` / ${offering.duration} min` : ''}
      </Text>

      <TouchableOpacity onPress={() => onDelete(offering)}>
        <Text style={styles.delete}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Theme.SPACING.card,
    borderWidth: 1,
    borderColor: Theme.COLORS.primary,
    borderRadius: 10,
    marginBottom: Theme.SPACING.card,
    marginHorizontal: Theme.SPACING.page,
  },
  title: {
    fontWeight: Theme.FONTS.weights.bold,
  },
  details: {
    color: Theme.COLORS.textSecondary,
  },
  delete: {
    color: Theme.COLORS.error,
    marginTop: 5,
  },
});
