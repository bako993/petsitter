import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeButtons from './HomeButtons';
import { useUsers } from '@/src/hooks/useUsers';
import { Alert } from 'react-native';

jest.mock('@/src/hooks/useUsers');
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('HomeButtons Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with no user', () => {
    (useUsers as jest.Mock).mockReturnValue({
      user: null,
      loadStoredUser: jest.fn(),
    });

    const { getByText } = render(<HomeButtons />);
    expect(getByText('Find Sitter')).toBeTruthy();
    expect(getByText('Become a Sitter')).toBeTruthy();
  });

  it('navigates to Search screen when Find Sitter is pressed', () => {
    (useUsers as jest.Mock).mockReturnValue({
      user: null,
      loadStoredUser: jest.fn(),
    });

    const { getByText } = render(<HomeButtons />);
    fireEvent.press(getByText('Find Sitter'));
    expect(mockNavigate).toHaveBeenCalledWith('MainTabs', { screen: 'Search' });
  });

  it('shows alert if Become Sitter pressed with no user', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    (useUsers as jest.Mock).mockReturnValue({
      user: null,
      loadStoredUser: jest.fn(),
    });

    const { getByText } = render(<HomeButtons />);
    await waitFor(() => {
      fireEvent.press(getByText('Become a Sitter'));
    });

    expect(alertSpy).toHaveBeenCalledWith('Error', 'User not loaded yet. Please log in.');
  });

  it('navigates to Profile if user has profile', () => {
    (useUsers as jest.Mock).mockReturnValue({
      user: { type: 'sitter', profile: true },
      loadStoredUser: jest.fn(),
    });

    const { getByText } = render(<HomeButtons />);
    fireEvent.press(getByText('Go to Profile'));
    expect(mockNavigate).toHaveBeenCalledWith('MainTabs', { screen: 'Profile' });
  });

  it('navigates to ProfileCompletionScreen if user has no profile', () => {
    (useUsers as jest.Mock).mockReturnValue({
      user: { type: 'owner', profile: false },
      loadStoredUser: jest.fn(),
    });

    const { getByText } = render(<HomeButtons />);
    fireEvent.press(getByText('Become a Sitter'));
    expect(mockNavigate).toHaveBeenCalledWith('ProfileCompletionScreen');
  });
});
