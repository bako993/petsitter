import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LocationMarkers } from './LocationMarkers';

jest.mock('react-native-maps', () => {
  const RealModule = jest.requireActual('react-native-maps');
  return {
    ...RealModule,
    Marker: (props: any) => {
      const { onPress, title } = props;
      const RN = require('react-native');
      return <RN.View onTouchStart={onPress} testID={`marker-${title}`} />;
    },
  };
});

describe('LocationMarkers', () => {
  const mockNavigate = jest.fn();
  const sitters = [
    { id: 1, name: 'Sitter1', latitude: 0, longitude: 0 },
    { id: 2, name: 'Sitter2', latitude: 1, longitude: 1 },
  ];

  it('renders markers and calls navigation on press', () => {
    const { getByTestId } = render(
      <LocationMarkers sitters={sitters} navigation={{ navigate: mockNavigate } as any} />,
    );

    fireEvent.press(getByTestId('marker-Sitter1'));
    expect(mockNavigate).toHaveBeenCalledWith('SitterScreen', { sitterId: 1 });

    fireEvent.press(getByTestId('marker-Sitter2'));
    expect(mockNavigate).toHaveBeenCalledWith('SitterScreen', { sitterId: 2 });
  });
});
