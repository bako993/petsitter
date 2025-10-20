import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/src/theme/theme';
import { ICONS } from '@/src/constants/icons';

interface LocationButtonProps {
  coordsCaptured: boolean;
  onPress: () => void;
}

export default function LocationButton({ coordsCaptured, onPress }: LocationButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons
        name={coordsCaptured ? ICONS.location : ICONS.locationOutline}
        size={Theme.FONTS.sizes.subtitle}
        color={Theme.COLORS.background}
        style={{ marginRight: 8 }}
      />
      <Text style={styles.text}>{coordsCaptured ? 'Location Captured' : 'Share My Location'}</Text>
      {coordsCaptured && (
        <Ionicons
          name={ICONS.checkMark}
          size={Theme.FONTS.sizes.body}
          color={Theme.COLORS.success}
          style={{ marginLeft: 8 }}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: Theme.COLORS.secondary,
    borderRadius: 8,
    paddingVertical: Theme.SPACING.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.SPACING.section,
  },
  text: {
    color: Theme.COLORS.background,
    fontSize: Theme.FONTS.sizes.body,
    fontWeight: Theme.FONTS.weights.semiBold,
  },
});
