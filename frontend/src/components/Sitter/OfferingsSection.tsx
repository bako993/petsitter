import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/src/theme/theme';
import { ICONS } from '@/src/constants/icons';

interface Offering {
  id: string | number;
  offering_type: string;
  price?: number;
  duration?: string;
  conditions?: string;
}

interface ServicesSectionProps {
  offerings: Offering[];
}

export const OfferingsSection: React.FC<ServicesSectionProps> = ({ offerings }) => {
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const animationHeight = useRef(new Animated.Value(0)).current;

  const handlePress = (offering: Offering) => {
    if (selectedOffering?.id === offering.id) {
      // hide
      Animated.timing(animationHeight, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start(() => setSelectedOffering(null));
    } else {
      setSelectedOffering(offering);
    }
  };

  useEffect(() => {
    if (selectedOffering) {
      Animated.timing(animationHeight, {
        toValue: 150,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [selectedOffering]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Services</Text>
      <View style={styles.servicesRow}>
        {offerings.length > 0 ? (
          offerings.map((o) => {
            const isSelected = selectedOffering?.id === o.id;
            return (
              <Pressable
                key={o.id}
                style={[
                  styles.serviceBadge,
                  isSelected && { backgroundColor: Theme.COLORS.primary },
                ]}
                onPress={() => handlePress(o)}
              >
                <Text style={styles.serviceText}>{o.offering_type}</Text>
                <Ionicons
                  name={isSelected ? ICONS.chevronUp : ICONS.info}
                  size={Theme.FONTS.sizes.body}
                  color={Theme.COLORS.background}
                  style={{ marginLeft: 6 }}
                />
              </Pressable>
            );
          })
        ) : (
          <Text style={styles.content}>No services offered</Text>
        )}
      </View>

      {offerings.length > 0 && <Text style={styles.hintText}>Tap a service for more details</Text>}

      {selectedOffering && (
        <Animated.View style={[styles.details, { height: animationHeight, overflow: 'hidden' }]}>
          <Text style={styles.detailText}>Price: ${selectedOffering.price}</Text>
          <Text style={styles.detailText}>Duration: {selectedOffering.duration}</Text>
          {selectedOffering.conditions && (
            <Text style={styles.detailText}>Conditions: {selectedOffering.conditions}</Text>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.COLORS.card,
    padding: Theme.SPACING.section,
    borderRadius: 16,
    marginBottom: Theme.SPACING.section,
  },
  title: {
    fontWeight: Theme.FONTS.weights.bold,
    fontSize: Theme.FONTS.sizes.body,
    marginBottom: Theme.SPACING.xs,
    color: Theme.COLORS.text,
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Theme.SPACING.xs,
  },
  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.COLORS.accent,
    paddingHorizontal: Theme.SPACING.sm,
    paddingVertical: Theme.SPACING.xs,
    borderRadius: 20,
    marginRight: Theme.SPACING.xs,
    marginBottom: Theme.SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceText: {
    color: Theme.COLORS.background,
    fontSize: Theme.FONTS.sizes.body,
  },
  hintText: {
    fontSize: Theme.FONTS.sizes.small,
    color: Theme.COLORS.textSecondary,
    marginTop: Theme.SPACING.xs,
    marginLeft: Theme.SPACING.xs,
    fontStyle: 'italic',
  },
  details: {
    backgroundColor: Theme.COLORS.card,
    padding: Theme.SPACING.sm,
    borderRadius: 12,
    marginTop: Theme.SPACING.xs,
  },
  detailText: {
    fontSize: Theme.FONTS.sizes.body,
    color: Theme.COLORS.textSecondary,
    marginBottom: 2,
  },
  content: {
    fontSize: Theme.FONTS.sizes.body,
    color: Theme.COLORS.textSecondary,
  },
});
