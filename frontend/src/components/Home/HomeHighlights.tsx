import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '@/src/theme/theme';
import HomeInfoCardBlocks from './HomeInfoCardBlocks';

export default function HomeHighlights() {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Why choose Petsitting?</Text>
      <HomeInfoCardBlocks />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  subtitle: {
    fontSize: Theme.FONTS.sizes.subtitle,
    fontWeight: Theme.FONTS.weights.semiBold,
    marginBottom: Theme.SPACING.section,
    color: Theme.COLORS.text,
    alignSelf: 'flex-start',
  },
});
