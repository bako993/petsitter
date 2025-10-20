import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  const mockSetQuery = jest.fn();

  it('renders correctly with initial query', () => {
    const { getByPlaceholderText } = render(<SearchBar query="initial" setQuery={mockSetQuery} />);

    const input = getByPlaceholderText('Search by sitter name or city');
    expect(input.props.value).toBe('initial');
  });

  it('calls setQuery when text changes', () => {
    const { getByPlaceholderText } = render(<SearchBar query="" setQuery={mockSetQuery} />);

    const input = getByPlaceholderText('Search by sitter name or city');
    fireEvent.changeText(input, 'new search');
    expect(mockSetQuery).toHaveBeenCalledWith('new search');
  });
});
