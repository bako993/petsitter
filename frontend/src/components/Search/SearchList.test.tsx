import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchList } from '@/src/components/Search/SearchList';

const mockNavigation = { navigate: jest.fn() } as any;

const mockSitters = [
  {
    id: 1,
    name: 'Alice',
    city: 'Amsterdam',
    rating: 4.5,
    reviews: 10,
    image: null,
    services: ['Walking', 'Feeding'],
  },
  {
    id: 2,
    name: 'Bob',
    city: 'Rotterdam',
    rating: 5,
    reviews: 20,
    image: null,
    services: ['Walking'],
  },
];

describe('SearchList', () => {
  it('renders a list of sitters', () => {
    const { getByText } = render(<SearchList sitters={mockSitters} navigation={mockNavigation} />);

    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('Bob')).toBeTruthy();
  });

  it('navigates to SitterScreen on card press', () => {
    const { getByText } = render(<SearchList sitters={mockSitters} navigation={mockNavigation} />);

    fireEvent.press(getByText('Alice'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('SitterScreen', { sitterId: 1 });
  });
});
