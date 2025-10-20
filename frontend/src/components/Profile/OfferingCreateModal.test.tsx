import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OfferingCreateModal from './OfferingCreateModal';

jest.mock('@/src/components/BaseEditModal', () => {
  return ({ children, onSave, onClose, visible }: any) => {
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

jest.mock('@/src/components/AppDropdown', () => {
  return ({ value, onChange, testID }: any) => {
    const RN = require('react-native');
    return <RN.TextInput testID={testID || 'dropdown'} value={value} onChangeText={onChange} />;
  };
});

describe('OfferingCreateModal', () => {
  const mockOnClose = jest.fn();
  const mockOnOfferingSaved = jest.fn();

  it('renders modal when visible', () => {
    const { getByTestId } = render(<OfferingCreateModal visible onClose={mockOnClose} />);
    expect(getByTestId('save-button')).toBeTruthy();
    expect(getByTestId('close-button')).toBeTruthy();
    expect(getByTestId('dropdown')).toBeTruthy();
  });

  it('calls onOfferingSaved with cleaned data on save', () => {
    const { getByTestId, getByPlaceholderText } = render(
      <OfferingCreateModal visible onClose={mockOnClose} onOfferingSaved={mockOnOfferingSaved} />,
    );

    fireEvent.changeText(getByTestId('dropdown'), 'Dog Walking');
    fireEvent.changeText(getByPlaceholderText('Price'), '12.5');
    fireEvent.changeText(getByPlaceholderText('Duration'), '45');
    fireEvent.changeText(getByPlaceholderText('Conditions'), 'a,b');

    fireEvent.press(getByTestId('save-button'));

    expect(mockOnOfferingSaved).toHaveBeenCalledWith({
      offering_type: 'Dog Walking',
      price: 12.5,
      duration: 45,
      conditions: ['a', 'b'],
    });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
