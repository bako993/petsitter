import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/src/theme/theme';

function InfoCard({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.card}>
      <Ionicons name={icon} size={32} color={Theme.COLORS.primary} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

export default function InfoCardsBlock() {
  return (
    <View style={styles.container}>
      <InfoCard
        icon="paw"
        title="Find Perfect Sitters"
        subtitle="Browse caring and experienced pet sitters"
      />
      <InfoCard
        icon="location"
        title="Local & Convenient"
        subtitle="Connect with nearby pet sitters"
      />
      <InfoCard icon="people" title="Trusted Care" subtitle="Reviewed and rated by pet owners" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  card: {
    backgroundColor: Theme.COLORS.card,
    padding: Theme.SPACING.card,
    borderRadius: 10,
    marginBottom: Theme.SPACING.section,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
    color: Theme.COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: Theme.COLORS.textSecondary,
  },
});
