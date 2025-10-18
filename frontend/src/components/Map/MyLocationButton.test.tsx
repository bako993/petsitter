import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyLocationButton from './MyLocationButton';
import { TouchableOpacity } from 'react-native';

describe('MyLocationButton', () => {
    it('renders correctly and calls onPress when pressed', () => {
        const onPressMock = jest.fn();
        const { UNSAFE_queryByProps } = render(<MyLocationButton onPress={onPressMock} />);

        const button = UNSAFE_queryByProps({ onPress: onPressMock }) as typeof TouchableOpacity;
        expect(button).toBeTruthy();

        // Press the button
        fireEvent.press(button);
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });
});

