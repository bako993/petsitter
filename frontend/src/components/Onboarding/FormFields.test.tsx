import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FormFields from './FormFields';

describe('FormFields Component', () => {
  const mockSetBio = jest.fn();
  const mockSetExperience = jest.fn();
  const mockSetPhone = jest.fn();
  const mockSetAvailability = jest.fn();

  const props = {
    bio: '',
    setBio: mockSetBio,
    experience: '',
    setExperience: mockSetExperience,
    phone: '',
    setPhone: mockSetPhone,
    availability: '',
    setAvailability: mockSetAvailability,
  };

  it('renders all inputs with correct labels', () => {
    const { getByText, getByPlaceholderText } = render(<FormFields {...props} />);

    expect(getByText('Bio')).toBeTruthy();
    expect(getByText('Experience')).toBeTruthy();
    expect(getByText('Phone')).toBeTruthy();
    expect(getByText('Availability')).toBeTruthy();

    expect(getByPlaceholderText('Tell us about yourself')).toBeTruthy();
    expect(getByPlaceholderText('Your experience with pets')).toBeTruthy();
    expect(getByPlaceholderText('Your phone number')).toBeTruthy();
    expect(getByPlaceholderText('e.g. Weekdays 9–5')).toBeTruthy();
  });

  it('calls onChange callbacks when typing', () => {
    const { getByPlaceholderText } = render(<FormFields {...props} />);

    fireEvent.changeText(getByPlaceholderText('Tell us about yourself'), 'I love pets');
    expect(mockSetBio).toHaveBeenCalledWith('I love pets');

    fireEvent.changeText(getByPlaceholderText('Your experience with pets'), '5 years');
    expect(mockSetExperience).toHaveBeenCalledWith('5 years');

    fireEvent.changeText(getByPlaceholderText('Your phone number'), '1234567890');
    expect(mockSetPhone).toHaveBeenCalledWith('1234567890');

    fireEvent.changeText(getByPlaceholderText('e.g. Weekdays 9–5'), 'Weekends only');
    expect(mockSetAvailability).toHaveBeenCalledWith('Weekends only');
  });
});
