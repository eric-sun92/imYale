import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import '@testing-library/jest-native/extend-expect';
import GameHistory from '../navigation/screens/Games/GameHistory';
import axios from 'axios';

jest.mock('axios');

describe('GameHistory', () => {
    it('renders correctly', async ()=>{
        const navigation = {
            replace: jest.fn(),
            navigate: jest.fn()
        }
        // Mock game object
        const game1 = {
            filter: jest.fn(),
            sort: jest.fn(),
            sport: "Soccer"
        };
        // Mock axios.get() method
        axios.get.mockResolvedValue({
            data: {
                games: [game1]
            }
        })
        const { getByText } = render(
            <GameHistory
                navigation={navigation}
            />
        )
        await waitFor(()=> {
            expect(getByText('Game History')).toBeTruthy();
        });
    });
});