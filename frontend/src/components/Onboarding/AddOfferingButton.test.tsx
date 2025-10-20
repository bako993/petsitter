import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddOfferingButton from './AddOfferingButton';

describe('AddOfferingButton Component', () => {
  it('renders correctly with text', () => {
    const mockPress = jest.fn();
    const { getByText } = render(<AddOfferingButton onPress={mockPress} />);

    expect(getByText('Add Offerings')).toBeTruthy();
  });

  it('calls onPress when button is pressed', () => {
    const mockPress = jest.fn();
    const { getByText } = render(<AddOfferingButton onPress={mockPress} />);

    fireEvent.press(getByText('Add Offerings'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });
});
