import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SearchComponent from '../Screens/SearchComponent';

test('renders correctly and handles input', () => {
  const mockSetSearchQuery = jest.fn();

  const {getByPlaceholderText, getByText} = render(
    <SearchComponent setSearchQuery={mockSetSearchQuery} />,
  );

  const input = getByPlaceholderText('Enter login');
  const button = getByText('Submit');

  fireEvent.changeText(input, 'johndoe');

  fireEvent.press(button);

  expect(mockSetSearchQuery).toHaveBeenCalledWith('johndoe');
});
