import React from 'react';
import { render } from '@testing-library/react-native';
import { SitterCard } from './SitterCard';
import { Image } from 'react-native';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('@/assets/images/avatar.jpg', () => 'mock-avatar.jpg');

describe('SitterCard', () => {
  const mockProfile = {
    user: { name: 'Jane Doe' },
    reviews: [{}, {}, {}],
  };

  it('renders sitter name, rating, and review count', () => {
    const { getByText } = render(
      <SitterCard
        profile={mockProfile}
        fullPhotoUri="https://example.com/photo.jpg"
        averageRating="4.5"
      />,
    );

    expect(getByText('Jane Doe')).toBeTruthy();
    expect(getByText('4.5')).toBeTruthy();
    expect(getByText('(3 reviews)')).toBeTruthy();
  });

  it("shows 'Unknown' when no name is available", () => {
    const profileWithoutName = { user: {}, reviews: [] };
    const { getByText } = render(<SitterCard profile={profileWithoutName} averageRating="5.0" />);

    expect(getByText('Unknown')).toBeTruthy();
  });

  it('uses fallback image when no fullPhotoUri is provided', () => {
    const { UNSAFE_queryAllByType } = render(
      <SitterCard profile={mockProfile} averageRating="4.0" />,
    );

    const image = UNSAFE_queryAllByType(Image)[0];
    expect(image.props.source).toEqual('mock-avatar.jpg');
  });
});
