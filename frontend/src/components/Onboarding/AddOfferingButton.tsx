import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Theme } from '@/src/theme/theme';

interface AddOfferingButtonProps {
  onPress: () => void;
}

export default function AddOfferingButton({ onPress }: AddOfferingButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Add Offerings</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Theme.COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: Theme.SPACING.card,
  },
  text: {
    color: Theme.COLORS.background,
    fontWeight: Theme.FONTS.weights.bold,
  },
});
