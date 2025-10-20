import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PhotoPicker from './PhotoPicker';
import * as ImagePicker from 'expo-image-picker';

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

describe('PhotoPicker', () => {
  const onImagePickedMock = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('renders placeholder when no imageUri', () => {
    const { getByText } = render(<PhotoPicker imageUri={null} onImagePicked={onImagePickedMock} />);

    expect(getByText('Add Photo')).toBeTruthy();
  });

  it('renders image when imageUri is provided', () => {
    const { UNSAFE_queryAllByProps } = render(
      <PhotoPicker imageUri="https://example.com/photo.jpg" onImagePicked={onImagePickedMock} />,
    );

    const images = UNSAFE_queryAllByProps({});

    const matchedImage = images.find(
      (img) => img.props.source?.uri === 'https://example.com/photo.jpg',
    );

    expect(matchedImage).toBeTruthy();
  });

  it('calls onImagePicked after picking image', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'picked-image.jpg' }],
    });

    const { getByText } = render(<PhotoPicker imageUri={null} onImagePicked={onImagePickedMock} />);
    fireEvent.press(getByText('Add Photo'));

    await waitFor(() => {
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
      expect(onImagePickedMock).toHaveBeenCalledWith('picked-image.jpg');
    });
  });
});
