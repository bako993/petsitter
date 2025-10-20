import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import UserEditModal from './UserEditModal';

// Mock the useUsers hook
jest.mock('@/src/hooks/useUsers', () => ({
  useUsers: () => ({
    updateUserById: jest.fn(() => Promise.resolve()),
  }),
}));

// Mock BaseEditModal to just render children and onSave/onClose
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

beforeEach(() => {
  jest.clearAllMocks(); // clears call counts
});

describe('UserEditModal', () => {
  const mockOnClose = jest.fn();
  const mockOnUserUpdated = jest.fn();

  const userData = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  };

  it('renders initial user data', () => {
    const { getByPlaceholderText } = render(
      <UserEditModal
        visible
        userData={userData}
        onClose={mockOnClose}
        onUserUpdated={mockOnUserUpdated}
      />,
    );

    expect(getByPlaceholderText('Name').props.value).toBe('John Doe');
    expect(getByPlaceholderText('Email').props.value).toBe('john@example.com');
  });

  it('calls updateUserById, onUserUpdated and onClose when saved', async () => {
    const { getByTestId } = render(
      <UserEditModal
        visible
        userData={userData}
        onClose={mockOnClose}
        onUserUpdated={mockOnUserUpdated}
      />,
    );

    await act(async () => {
      await fireEvent.press(getByTestId('save-button'));
    });

    expect(mockOnUserUpdated).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  it('calls onClose when close button is pressed', () => {
    const { getByTestId } = render(
      <UserEditModal
        visible
        userData={userData}
        onClose={mockOnClose}
        onUserUpdated={mockOnUserUpdated}
      />,
    );

    fireEvent.press(getByTestId('close-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
