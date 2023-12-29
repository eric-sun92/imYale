import GameSummary from "../navigation/screens/Games/GameSummary";
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import '@testing-library/jest-native/extend-expect';
jest.mock('axios');
import axios from 'axios';

describe('GameSummary', () => {
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
    it('renders correctly', async ()=>{
        axios.get.mockResolvedValue({
            data: {
                game: {
                    gameID: '1',
                    team1: 'Pierson',
                    team2: 'Davenport',
                    scoreHome: '2',
                    scoreAway: '1',
                    winner: 'Pierson',
                    team1Users: {
                        find: jest.fn().mockReturnValue("Player1"),
                        map: jest.fn(),
                    },
                    team2Users: {
                        find: jest.fn().mockReturnValue("Player2"),
                        map: jest.fn()
                    },
                    sport: 'Soccer',
                    date: new Date(),
                    completed: true,
                    // Extra fields for other axios.get() calls
                    user: {
                        netid: "xyz"
                    }
                }
            }
        });

        const navigationMock = {
            navigate: jest.fn(),
        };

        const { getByText } = render(
            <GameSummary 
                route={route}
                navigation={navigationMock}
            />
        );
        await waitFor(()=>{
            expect(getByText('Attendees')).toBeTruthy();
        });
    });
});