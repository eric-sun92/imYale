import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import NewMessage from '../navigation/components/newMessage';



describe('NewMessage', () => { 
    it('renders successfully when visible', () => {
        const { getByText, getByPlaceholderText } = render(
            <NewMessage
                visible={true}
                onClose={() => {}}
                onSubmit={() => {}}
                inputValue={'TEST 1 2 3'}
                setInputValue={() => {}}
            />
        );

        // Assert presence of UI elements
        expect(getByText('X')).toBeTruthy();
        expect(getByPlaceholderText('Enter your text here')).toBeTruthy();
    });

    it('triggers onClose when close button is pressed', () => {
        const onCloseMock = jest.fn();

        const { getByText } = render(
            <NewMessage
                visible={true}
                onClose={onCloseMock}
                onSubmit={() => {}}
                inputValue={'TEST 1 2 3'}
                setInputValue={() => {}}
            />
        );
        
        // Trigger close button
        fireEvent.press(getByText('X'));
        // Assert onClose was called
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('triggers onSubmit when submit button is pressed', () => {
        const onSubmitMock = jest.fn();

        const { getByText } = render(
            <NewMessage
                visible={true}
                onClose={() => {}}
                onSubmit={onSubmitMock}
                inputValue={'TEST 1 2 3'}
                setInputValue={() => {}}
            />
        );
        
        // Trigger close button
        fireEvent.press(getByText('Submit'));
        // Assert onClose was called
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });
 });