import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Theme } from '@/src/theme/theme';

type DropdownItem = {
  label: string;
  value: string;
};

type Props = {
  label?: string;
  items: DropdownItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  zIndex?: number;
  disabled?: boolean;
};

export default function AppDropdown({
  label,
  items,
  value,
  onChange,
  placeholder = 'Select an option',
  zIndex = 1000,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View style={[styles.container, { zIndex }]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(val: any) => onChange(val())}
        placeholder={placeholder}
        disabled={disabled}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={styles.text}
        placeholderStyle={styles.placeholder}
        arrowIconStyle={styles.arrowIcon}
        labelStyle={styles.itemLabel}
        listItemContainerStyle={styles.itemContainer}
        listItemLabelStyle={styles.itemLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Theme.SPACING.section,
  },
  label: {
    fontSize: Theme.FONTS.sizes.body,
    fontWeight: Theme.FONTS.weights.semiBold,
    color: Theme.COLORS.text,
    marginBottom: 6,
  },
  dropdown: {
    backgroundColor: Theme.COLORS.cardSkyBlue,
    borderColor: Theme.COLORS.primary,
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 8,
    ...Theme.SHADOWS.default,
  },
  dropdownContainer: {
    borderColor: Theme.COLORS.primary,
    borderRadius: 12,
    backgroundColor: Theme.COLORS.background,
    ...Theme.SHADOWS.default,
  },
  text: {
    color: Theme.COLORS.textSecondary,
    fontSize: Theme.FONTS.sizes.body,
  },
  placeholder: {
    color: Theme.COLORS.textSecondary,
    fontSize: Theme.FONTS.sizes.body,
  },
  arrowIcon: {
    width: 18,
    height: 18,
  },
  itemContainer: {
    paddingVertical: 10,
  },
  itemLabel: {
    color: Theme.COLORS.text,
    fontSize: Theme.FONTS.sizes.body,
  },
});
