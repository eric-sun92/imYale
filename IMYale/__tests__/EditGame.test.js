import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import '@testing-library/jest-native/extend-expect';
import ReservationForm from '../navigation/screens/Games/EditGame';
import axios from 'axios';


jest.mock('axios');

describe('EditGameForm', () => {
    const route = {
        params: {
            gameID: '1',
            team1: 'Pierson',
            team2: 'Davenport',
            scoreHome: '2',
            scoreAway: '1',
            winner: 'Pierson',
            team1Users: ['Adino', 'Mark'],
            team2Users: ['Munene', 'Namasaka'],
            sport: 'Soccer',
            date: new Date(),
            completed: true,
        },
    };

    it('renders successfully', async ()=> {
        // Mock axios.put method
        axios.put.mockResolvedValue({});
        const replaceMock = jest.fn();
        const navigationMock = {
            replace: replaceMock,
        };

        const { getByText} = render(
            <ReservationForm 
                route={route}
                navigation={navigationMock}
            />
        );
        await waitFor (()=> {
            expect(getByText('Edit Game')).toBeTruthy();
        });
    });
});