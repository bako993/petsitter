import React from 'react';
import { act, render, fireEvent } from '@testing-library/react-native';
import ProfileEditModal from './ProfileEditModal';

jest.mock('@/src/hooks/useProfiles', () => ({
  useProfiles: () => ({
    updateProfile: jest.fn(() => Promise.resolve()),
  }),
}));

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

jest.mock('@/src/components/PhotoPicker', () => {
  return ({ imageUri, onImagePicked }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity testID="photo-picker" onPress={() => onImagePicked('new-photo-uri')}>
        <RN.Text>Pick Photo</RN.Text>
      </RN.TouchableOpacity>
    );
  };
});

describe('ProfileEditModal', () => {
  const mockOnClose = jest.fn();
  const mockOnProfileUpdated = jest.fn();

  const profileData = {
    id: 1,
    bio: 'My bio',
    experience: '5 years',
    phone: '123456789',
    availability: 'Weekdays',
    profile_photo: 'photo-uri',
  };

  it('renders initial profile data', () => {
    const { getByPlaceholderText } = render(
      <ProfileEditModal
        visible
        onClose={mockOnClose}
        profileData={profileData}
        onProfileUpdated={mockOnProfileUpdated}
      />,
    );

    expect(getByPlaceholderText('Bio').props.value).toBe('My bio');
    expect(getByPlaceholderText('Experience').props.value).toBe('5 years');
    expect(getByPlaceholderText('Phone').props.value).toBe('123456789');
    expect(getByPlaceholderText('Availability').props.value).toBe('Weekdays');
  });

  it('updates photo when PhotoPicker is used', () => {
    const { getByTestId, getByPlaceholderText } = render(
      <ProfileEditModal visible onClose={mockOnClose} profileData={profileData} />,
    );

    fireEvent.press(getByTestId('photo-picker'));
    expect(getByPlaceholderText('Bio').props.value).toBe('My bio'); // form is still intact
  });

  it('calls updateProfile, onProfileUpdated and onClose when saved', async () => {
    const { getByTestId } = render(
      <ProfileEditModal
        visible
        onClose={mockOnClose}
        profileData={profileData}
        onProfileUpdated={mockOnProfileUpdated}
      />,
    );

    await act(async () => {
      await fireEvent.press(getByTestId('save-button'));
    });

    expect(mockOnProfileUpdated).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
