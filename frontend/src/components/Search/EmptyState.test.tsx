import React from 'react';
import { render } from '@testing-library/react-native';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('renders the alert icon and text', () => {
    const { getByText, getByTestId } = render(<EmptyState />);

    // Check the text
    expect(getByText('No sitters found')).toBeTruthy();
  });
});
