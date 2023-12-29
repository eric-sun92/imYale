import Leaderboard from "../navigation/screens/Leaderboard/Leaderboard";
import axios from "axios";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

// Mock axios module
jest.mock('axios');

describe('Leaderboard', () => {
    // Mock navigate method
    const navigate = jest.fn()
    it('renders correctly', async () => {
        // Sample game data
        const game = {
            gameID: '1',
            team1: 'Pierson',
            team2: 'Davenport',
            scoreHome: 2,
            scoreAway: 1,
            sport: 'basketball'
        }
        // Mock axios.get() method
        axios.get.mockResolvedValue({
            data: {
                games: [game, game, game]
            }
        });
        // Render Leaderboard component
        const { getByText } = render(<Leaderboard navigation={{navigate: navigate}}/>);

        // Assert UI components
        await waitFor(()=> {
            expect(getByText('Select Sport Below')).toBeTruthy();
        });
    });
});
