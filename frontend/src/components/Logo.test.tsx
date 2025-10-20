import React from 'react';
import { render } from '@testing-library/react-native';
import Logo from './Logo';
import { Image } from 'react-native';

describe('Logo component', () => {
  it('renders the title text', () => {
    const { getByText } = render(<Logo />);
    expect(getByText('Petsitting')).toBeTruthy();
  });

  it('renders the logo image with correct source', () => {
    const { UNSAFE_queryAllByType } = render(<Logo />);
    const images = UNSAFE_queryAllByType(Image);

    expect(images.length).toBe(1);

    const imgSource = images[0].props.source;
    expect(typeof imgSource).toBe('object');
  });
});
