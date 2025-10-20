import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Theme } from '@/src/theme/theme';

interface LocationFormProps {
  city: string;
  postalCode: string;
  street: string;
  houseNumber: string;
  setCity: (val: string) => void;
  setPostalCode: (val: string) => void;
  setStreet: (val: string) => void;
  setHouseNumber: (val: string) => void;
}

export default function LocationForm({
  city,
  postalCode,
  street,
  houseNumber,
  setCity,
  setPostalCode,
  setStreet,
  setHouseNumber,
}: LocationFormProps) {
  return (
    <View style={styles.form}>
      <FormField
        label="City (optional)"
        value={city}
        onChangeText={setCity}
        placeholder="e.g., Amsterdam"
      />
      <FormField
        label="Postal Code (optional)"
        value={postalCode}
        onChangeText={setPostalCode}
        placeholder="e.g., 1012AB"
      />
      <FormField
        label="Street (optional)"
        value={street}
        onChangeText={setStreet}
        placeholder="e.g., Main Street"
      />
      <FormField
        label="House Number (optional)"
        value={houseNumber}
        onChangeText={setHouseNumber}
        placeholder="e.g., 12A"
      />

      <View style={styles.requiredNote}>
        <Text style={styles.requiredText}>
          * Sharing your location is{' '}
          <Text style={{ fontWeight: Theme.FONTS.weights.bold }}>required</Text> to continue.
        </Text>
      </View>
    </View>
  );
}

function FormField({ label, value, onChangeText, placeholder }: any) {
  return (
    <View style={{ marginBottom: Theme.SPACING.sm }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Theme.COLORS.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginVertical: Theme.SPACING.sm,
  },
  label: {
    color: Theme.COLORS.textSecondary,
    marginBottom: Theme.SPACING.xs,
    fontSize: Theme.FONTS.sizes.small,
  },
  input: {
    backgroundColor: Theme.COLORS.cardSkyBlue,
    borderRadius: 8,
    padding: Theme.SPACING.sm,
    color: Theme.COLORS.text,
  },
  requiredNote: {
    marginTop: Theme.SPACING.xs,
  },
  requiredText: {
    color: Theme.COLORS.textSecondary,
    fontSize: Theme.FONTS.sizes.small,
    textAlign: 'center',
  },
});
