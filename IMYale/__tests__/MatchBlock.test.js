import React from 'react';
import {render} from '@testing-library/react-native';
import MatchBlock from '../navigation/components/MatchBlock v3';
import '@testing-library/jest-native/extend-expect';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

describe('Matchblock', () => {
  const sampleGame = {
    _id: 1,
    team1: 'Pierson',
    team2: 'Davenport',
    score: '2 - 1',
    winner: 'Pierson',
    team1Users: ['Tony', 'Brian', 'Kolil'],
    team2Users: ['Namasaka', 'Zingzing', 'Adino'],
    sport: 'Soccer',
    date: new Date(),
  };

  const MatchBlockScreen = () => (
    <MatchBlock
      _id={sampleGame._id}
      team1={sampleGame.team1}
      team2={sampleGame.team2}
      score={sampleGame.score}
      winner={sampleGame.team1}
      team1Users={sampleGame.team1Users}
      team2Users={sampleGame.team2Users}
      sport={sampleGame.sport}
      date={sampleGame.date}
    />
  );
  it('should render successfully', () => {
    const {getByText} = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="MatchBlock">{MatchBlockScreen}</Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>,
    );
    expect(getByText(sampleGame.team1)).toBeTruthy();
  });
});
