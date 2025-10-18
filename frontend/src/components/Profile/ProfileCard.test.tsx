import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import ProfileCard from './ProfileCard';

describe('ProfileCard', () => {
    it('renders the title correctly', () => {
        const { getByText } = render(<ProfileCard title="My Profile" />);
        expect(getByText('My Profile')).toBeTruthy();
    });

    it('renders content when no children are provided', () => {
        const { getByText } = render(<ProfileCard title="Bio" content="This is my bio" />);
        expect(getByText('This is my bio')).toBeTruthy();
    });

    it('renders children instead of content if provided', () => {
        const { getByText } = render(
            <ProfileCard title="Bio">
                <Text>Child content</Text>
            </ProfileCard>
        );
        expect(getByText('Child content')).toBeTruthy();
    });
});
