import React from 'react';
import { render } from '@testing-library/react-native';
import HomeHighlights from './HomeHighlights';

jest.mock('./HomeInfoCardBlocks', () => {
    const { Text } = require('react-native');
    return () => <Text testID="home-info-card" />;
});

describe('HomeHighlights Component', () => {
    it('renders subtitle', () => {
        const { getByText } = render(<HomeHighlights />);
        expect(getByText('Why choose Petsitting?')).toBeTruthy();
    });

    it('renders HomeInfoCardBlocks component', () => {
        const { getByTestId } = render(<HomeHighlights />);
        expect(getByTestId('home-info-card')).toBeTruthy();
    });
});
