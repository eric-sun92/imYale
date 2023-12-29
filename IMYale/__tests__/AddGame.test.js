import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import '@testing-library/jest-native/extend-expect';
import ReservationForm from '../navigation/screens/Games/AddGame';
import axios from 'axios';

jest.mock('axios');

describe('AddGameForm', () => { 
   it('renders correctly', () => {
        const navigationMock = jest.fn();
        const { getByText } = render(
            <ReservationForm
                navigation={{ replace: navigationMock }}
            />
        );

        expect(getByText('Add Game')).toBeTruthy();
   }); 

   it('handles form submission', async() => {
    const navigationMock = jest.fn();
    const { getByText, getByTestId } = render(
        <ReservationForm
            navigation={{ replace: navigationMock }}
        />
    );

    // Mock axios post requests
    axios.post.mockResolvedValue({});
    console.log(getByTestId)
    // Simulate user interactions by filling in form fields
    fireEvent.changeText(getByTestId('rescoPicker1'), 'PS');
    fireEvent.changeText(getByTestId('rescoPicker2'), 'DP');
    fireEvent.changeText(getByTestId('dateTimePicker'), '2030-12-12T09:00:00');
    fireEvent.changeText(getByTestId('sportPicker'), 'Soccer');
    fireEvent.press(getByTestId('submitButton'));

    //expect(getByTestId('sportPicker').props.selectedValue).toBe('Soccer');

    // Wait for async actions
    await waitFor(() => {
        // expect(axios.post).toHaveBeenCalledTimes(3);
        // expect(navigationMock).toHaveBeenCalled();
        //expect(getByText('Home')).toBeTruthy()
    });
   });
});