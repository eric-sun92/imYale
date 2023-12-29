import MessageScreen from "../navigation/screens/z_Extra Screens/MessageScreen";
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

describe('MessageScreen', () => {
    // Mock navigation 
    const navigateMock = jest.fn();
    it('renders correctly', ()=>{
        // Render test MessageScreen
        const { getByText } = render(<MessageScreen navigation={{navigate:navigateMock}}/>)
        // Assert UI components
        expect(getByText('Send')).toBeTruthy()
    });

    it('handles send logic correctly', ()=> {
        // Mock navigation object
        const { getByText } = render(<MessageScreen navigation={{
            navigate: navigateMock,
        }}/>)
        // Trigger Login button
        fireEvent.press(getByText('Send'));
        // Assert 'handleLogin' function was called
        expect(navigateMock).toHaveBeenCalledWith('Main');
    });
});