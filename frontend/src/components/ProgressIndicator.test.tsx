import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressIndicator from './ProgressIndicator';

describe('ProgressIndicator', () => {
    const steps = ['Step 1', 'Step 2', 'Step 3'];

    it('renders correct number of steps', () => {
        const { getByText } = render(<ProgressIndicator steps={steps} currentStep={1} />);

        steps.forEach((step) => {
            expect(getByText(step)).toBeTruthy();
        });

        expect(getByText('2')).toBeTruthy();
    });

});

