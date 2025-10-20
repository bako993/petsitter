import React from 'react';
import { render } from '@testing-library/react-native';
import { ProfileHeader, ProfileHeaderProps } from './ProfileHeader';
import { Image } from 'react-native';

describe('ProfileHeader', () => {
  const defaultProps: ProfileHeaderProps = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  it('renders name and email correctly', () => {
    const { getByText } = render(<ProfileHeader {...defaultProps} />);

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('john@example.com')).toBeTruthy();
  });

  it('renders profile image if provided', () => {
    const imageSource = { uri: 'https://example.com/photo.jpg' };
    const { UNSAFE_getByType } = render(
      <ProfileHeader {...defaultProps} profileImage={imageSource} />,
    );

    const image = UNSAFE_getByType(Image);
    expect(image.props.source).toEqual(imageSource);
  });

  it('does not render image when profileImage is not provided', () => {
    const { UNSAFE_queryByType } = render(<ProfileHeader {...defaultProps} />);
    expect(UNSAFE_queryByType(Image)).toBeNull();
  });

  it('does not render image when profileImage is not provided', () => {
    const { queryByRole } = render(<ProfileHeader {...defaultProps} />);
    expect(queryByRole('image')).toBeNull();
  });
});
