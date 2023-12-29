import LoginInputScreen from "../navigation/screens/z_Extra Screens/LoginInputScreen";
import { render, fireEvent } from "@testing-library/react-native";


describe('LoginInputScreen', () => {
    // Mock navigation object
    const navigationMock = jest.fn();
    it('renders correctly', ()=> {
        const { getByText } = render(<LoginInputScreen navigation={{navigate: navigationMock}}/>)
        // Assert UI elements
        expect(getByText('ImYale')).toBeTruthy()
    });

    it('handles login logic correctly', ()=> {
        // Mock navigation object
        const replaceMock = jest.fn();
        const { getByText } = render(<LoginInputScreen navigation={{
            navigate: navigationMock,
            replace: replaceMock
        }}/>)
        // Trigger Login button
        fireEvent.press(getByText('Login'));
        // Assert 'handleLogin' function was called
        expect(replaceMock).toHaveBeenCalledWith('Main');
    });
});