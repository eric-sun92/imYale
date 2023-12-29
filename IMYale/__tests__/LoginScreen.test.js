import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import '@testing-library/jest-native/extend-expect';
import LoginScreen from '../navigation/screens/Login/LoginScreen';

// Mock CookieManager dependency
jest.mock('@react-native-cookies/cookies');
jest.mock('react-native-elements');


describe('LoginScreen', () => { 
    it('renders successfully', () => {
        const { getByText } = render(
            <LoginScreen
                navigation={{ replace: jest.fn() }}
            />
        );
        expect(getByText('imYale')).toBeTruthy();
    });

    it('displays WebView when "Sign In With CAS is pressed"', async () => {
        const { getByText, getByTestId } = render(
            <LoginScreen
                navigation={{ replace: jest.fn() }}
            />
        );
        await waitFor(()=>{
            // Press "Sign In With CAS"
            fireEvent.press(getByTestId('loginButton'));
            expect(getByTestId('web-view')).toBeTruthy();
        });
    });
 });