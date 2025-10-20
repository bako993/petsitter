import React from 'react';
import { Text, FlatList, TouchableOpacity, StyleSheet, View } from 'react-native';
import BaseEditModal from '@/src/components/BaseEditModal';
import { Theme } from '@/src/theme/theme';
import { Offering } from '@/src/types/types';

type Props = {
  visible: boolean;
  offerings: any[];
  onClose: () => void;
  onSelectOffering: (offering: Offering) => void;
  onDeleteOffering: (offering: Offering) => void;
};

export default function OfferingEditModal({
  visible,
  offerings,
  onClose,
  onSelectOffering,
  onDeleteOffering,
}: Props) {
  return (
    <BaseEditModal visible={visible} title="Edit Offerings" onClose={onClose} onSave={onClose}>
      {offerings.length > 0 ? (
        <FlatList
          data={offerings}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={true}
          renderItem={({ item }) => (
            <View style={styles.offeringItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.offering_type}</Text>
                <Text style={styles.details}>
                  Price: ${item.price}
                  {item.duration ? ` / ${item.duration} min` : ''}
                  {'\n'}
                  {item.conditions?.join(', ')}
                </Text>
              </View>

              {/* Edit button */}
              <TouchableOpacity style={styles.actionButton} onPress={() => onSelectOffering(item)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>

              {/* Delete button */}
              <TouchableOpacity style={styles.actionButton} onPress={() => onDeleteOffering(item)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noOfferings}>No offerings to edit</Text>
      )}
    </BaseEditModal>
  );
}

const styles = StyleSheet.create({
  offeringItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.COLORS.primary,
  },
  title: {
    fontWeight: 'bold',
    color: Theme.COLORS.text,
    fontSize: Theme.FONTS.sizes.subtitle,
  },
  details: {
    color: Theme.COLORS.textSecondary,
    fontSize: Theme.FONTS.sizes.body,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: Theme.COLORS.cardSkyBlue,
  },
  deleteButton: {
    backgroundColor: Theme.COLORS.error,
  },
  editText: {
    color: Theme.COLORS.primary,
    fontWeight: Theme.FONTS.weights.semiBold,
  },
  deleteText: {
    color: Theme.COLORS.error,
    fontWeight: Theme.FONTS.weights.semiBold,
  },
  noOfferings: {
    textAlign: 'center',
    marginTop: 20,
    color: Theme.COLORS.textSecondary,
  },
});
