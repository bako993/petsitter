import React from 'react';
import { render } from '@testing-library/react-native';
import InfoCardsBlock from './HomeInfoCardBlocks';

jest.mock('@expo/vector-icons', () => {
    return {
        Ionicons: (props: any) => {
            return <props.name testID={`icon-${props.name}`} />;
        },
    };
});

describe('InfoCardsBlock Component', () => {
    it('renders all three InfoCards with correct titles and subtitles', () => {
        const { getByText } = render(<InfoCardsBlock />);

        // Check first card
        expect(getByText('Find Perfect Sitters')).toBeTruthy();
        expect(getByText('Browse caring and experienced pet sitters')).toBeTruthy();

        // Check second card
        expect(getByText('Local & Convenient')).toBeTruthy();
        expect(getByText('Connect with nearby pet sitters')).toBeTruthy();

        // Check third card
        expect(getByText('Trusted Care')).toBeTruthy();
        expect(getByText('Reviewed and rated by pet owners')).toBeTruthy();
    });

    it('renders Ionicons icons for each InfoCard', () => {
        const { getByTestId } = render(<InfoCardsBlock />);

        expect(getByTestId('icon-paw')).toBeTruthy();
        expect(getByTestId('icon-location')).toBeTruthy();
        expect(getByTestId('icon-people')).toBeTruthy();
    });
});
