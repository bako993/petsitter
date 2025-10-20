import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OfferingEditModal from './OfferingEditModal';
import { Offering } from '@/src/types/types';

jest.mock('@/src/components/BaseEditModal', () => {
  return ({ children, onClose, onSave, visible }: any) => {
    if (!visible) return null;
    const RN = require('react-native');
    return (
      <RN.View>
        {children}
        <RN.TouchableOpacity testID="save-button" onPress={onSave} />
        <RN.TouchableOpacity testID="close-button" onPress={onClose} />
      </RN.View>
    );
  };
});

describe('OfferingEditModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSelect = jest.fn();
  const mockOnDelete = jest.fn();

  const offerings: Offering[] = [
    {
      id: 1,
      profile_id: 101,
      offering_type: 'Dog Walking',
      price: 20,
      duration: 30,
      conditions: ['Friendly with dogs'],
    },
    {
      id: 2,
      profile_id: 101,
      offering_type: 'Pet Sitting',
      price: 25,
      conditions: ['Cat friendly'],
    },
  ];

  it('renders offerings correctly', () => {
    const { getByText } = render(
      <OfferingEditModal
        visible
        offerings={offerings}
        onClose={mockOnClose}
        onSelectOffering={mockOnSelect}
        onDeleteOffering={mockOnDelete}
      />,
    );

    expect(getByText('Dog Walking')).toBeTruthy();
    expect(getByText('Price: $20 / 30 min\nFriendly with dogs')).toBeTruthy();
    expect(getByText('Pet Sitting')).toBeTruthy();
    expect(getByText('Price: $25\nCat friendly')).toBeTruthy();
  });

  it('calls onSelectOffering when Edit is pressed', () => {
    const { getAllByText } = render(
      <OfferingEditModal
        visible
        offerings={offerings}
        onClose={mockOnClose}
        onSelectOffering={mockOnSelect}
        onDeleteOffering={mockOnDelete}
      />,
    );

    fireEvent.press(getAllByText('Edit')[0]);
    expect(mockOnSelect).toHaveBeenCalledWith(offerings[0]);
  });

  it('calls onDeleteOffering when Delete is pressed', () => {
    const { getAllByText } = render(
      <OfferingEditModal
        visible
        offerings={offerings}
        onClose={mockOnClose}
        onSelectOffering={mockOnSelect}
        onDeleteOffering={mockOnDelete}
      />,
    );

    fireEvent.press(getAllByText('Delete')[1]);
    expect(mockOnDelete).toHaveBeenCalledWith(offerings[1]);
  });

  it('calls onClose when save button is pressed', () => {
    const { getByTestId } = render(
      <OfferingEditModal
        visible
        offerings={offerings}
        onClose={mockOnClose}
        onSelectOffering={mockOnSelect}
        onDeleteOffering={mockOnDelete}
      />,
    );

    fireEvent.press(getByTestId('save-button'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows fallback text when no offerings', () => {
    const { getByText } = render(
      <OfferingEditModal
        visible
        offerings={[]}
        onClose={mockOnClose}
        onSelectOffering={mockOnSelect}
        onDeleteOffering={mockOnDelete}
      />,
    );

    expect(getByText('No offerings to edit')).toBeTruthy();
  });
});
