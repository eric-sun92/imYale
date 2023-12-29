import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';

import MainPage from '../navigation/MainPage.js';
// Mocking dependencies
jest.mock('@react-navigation/bottom-tabs', () => {
  const TabNavigatorMock = jest.fn(({children}) => (
    <div testID="tabNavigator">{children}</div>
  ));

  const createBottomTabNavigator = jest.fn(() => ({
    Navigator: TabNavigatorMock,
    Screen: jest.fn(({name, component}) => (
      <div testID={`tabScreen-${name}`}>{component}</div>
    )),
  }));

  return {
    createBottomTabNavigator,
    TabNavigatorMock,
  };
});
jest.mock('../navigation/screens/Games/HomeScreen', () => 'HomeScreen');
jest.mock('../navigation/screens/Profile/ProfileScreen', () => 'ProfileScreen');
// jest.mock('../navigation/screens/DMScreen', () => 'DMScreen');
jest.mock('../navigation/screens/Leaderboard/Leaderboard', () => 'Leaderboard');
jest.mock(
  '../navigation/screens/Announcements/AnnouncementsPage',
  () => 'AnnouncementsPage',
);
jest.mock('../navigation/screens/Calendar/CalendarPage', () => 'CalendarPage');

describe('MainPage', () => {
  it('renders the tab navigator with correct screens', async () => {
    const {getByTestId} = render(<MainPage />);

    expect(getByTestId('tabNavigator')).toBeTruthy();
    expect(getByTestId('tabScreen-Leaderboard')).toBeTruthy();
    expect(getByTestId('tabScreen-Home')).toBeTruthy();
    expect(getByTestId('tabScreen-Announcements')).toBeTruthy();
    expect(getByTestId('tabScreen-Profile')).toBeTruthy();
  });

  it('was called with appropriate props', () => {
    // Render component
    render(<MainPage />);
    // Access the mocked TabNavigatorMock
    const {TabNavigatorMock} = require('@react-navigation/bottom-tabs');

    // Check if TabNavigatorMock has been called with the correct props
    expect(TabNavigatorMock).toHaveBeenCalledTimes(2);
  });
});
