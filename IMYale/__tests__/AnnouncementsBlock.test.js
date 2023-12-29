import React from 'react';
import AnnouncementBlock from '../navigation/components/AnnouncementsBlock';
import {render} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {colleges} from '../global';

const Stack = createStackNavigator();

describe('Announcement Block', () => {
  const sampleProps = {
    _id: 1,
    gameID: 1,
    team1: 'PS',
    team2: 'DP',
    sport: 'soccer',
    date: new Date(),
    announcement: 'a62kf82012j',
  };

  const sampleAnnouncementBlock = () => (
    <AnnouncementBlock
      _id={sampleProps._id}
      gameID={sampleProps.gameID}
      team1={sampleProps.team1}
      team2={sampleProps.team2}
      sport={sampleProps.sport}
      date={sampleProps.date}
      announcement={sampleProps.announcement}
    />
  );

  it('renders successfully', () => {
    const {getByText} = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Announcements Block">
            {sampleAnnouncementBlock}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>,
    );

    expect(
      getByText(
        `${colleges[sampleProps.team1]} vs ${colleges[sampleProps.team2]}`,
      ),
    ).toBeTruthy();
  });
});
