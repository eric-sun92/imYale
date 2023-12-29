import HomeScreen from "../navigation/screens/Games/HomeScreen";
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import axios from 'axios';
jest.mock('axios');

const Stack = createStackNavigator();
jest.mock('../navigation/components/MatchBlock');

describe('HomeScreen', () => {
    it('renders correctly', async ()=>{
        const navigateMock = {
            replace: jest.fn(),
        };
        // Mock game object
        const game1 = {
            filter: jest.fn(),
            sort: jest.fn(),
            sport: "Soccer"
        };
        // Mock axios.get() request
        axios.get.mockResolvedValue({
            data: {
                games: [game1],
                user: {
                    college: "Pierson"
                },
            },
        });

        const matchBlock = () => {
            <HomeScreen navigation={navigateMock}/>
        }

        const { getByText } = render(
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name='HomeScreen'>
                    {()=> <HomeScreen navigation={navigateMock}/>}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        );

        await waitFor(()=> {
            expect(getByText('Select Sport Below')).toBeTruthy();
        });
    });
});