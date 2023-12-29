import ProfileScreen from "../navigation/screens/Profile/ProfileScreen";
import { render, waitFor } from "@testing-library/react-native";
import axios from "axios";

jest.mock('axios');
jest.mock('../navigation/components/MatchBlock');


describe('ProfileScreen', () => {
    // Mock game object
    const game1 = {
        filter: jest.fn(),
        sort: jest.fn(),
        sport: "Soccer",
        winner: "Pierson",
    };
    // Sample user data
    const userData = {
        data: {
            user: {
                college: "PS",
                first_name: "Munene",
                last_name: "Kinyua",
                netid: "uydbs",
                year: "2025",
            },
            games: [game1, game1, game1]
        },
    };

    it('renders correctly', async () => {
        const navigationMock = jest.fn();
        // Mock axios.get() method 
        axios.get.mockResolvedValue(userData);
        const { getByText } = render(<ProfileScreen navigation={{navigate: navigationMock}}/>)

        await waitFor(()=>{
            expect(getByText('Munene Kinyua')).toBeTruthy()
        });
    });
});