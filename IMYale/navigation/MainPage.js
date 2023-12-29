import * as React from 'react';
import {Image} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SvgUri} from 'react-native-svg';

// Importing screens
import HomeScreen from './screens/Games/HomeScreen';
import ProfileScreen from './screens/Profile/ProfileScreen';
import DMScreen from './screens/z_Extra Screens/DMScreen';
import Leaderboard from './screens/Leaderboard/Leaderboard';
import Announcements from './screens/Announcements/AnnouncementsPage';
import CalendarPage from './screens/Calendar/CalendarPage';

// Names for each screen in the navigation
const homeName = 'Home';
const profileName = 'Profile';
const dmName = 'DM';
const announcements = 'Announcements';
const gameSummary = 'GameSummary';
const leaderboard = 'Leaderboard';
const calendar = 'Calendar';

// Creating a bottom tab navigator
const Tab = createBottomTabNavigator();

/**
 * MainPage Component
 *
 * This component sets up the bottom tab navigation for the app, allowing users to switch between different screens.
 * It uses custom icons for each tab, which change based on the active state of the tab.
 *
 * @returns {React.Component} - The main page component with bottom tab navigation.
 */
export default function MainPage() {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconUri;
          let rn = route.name;
          if (rn === homeName) {
            iconUri = focused
              ? require('../assets/icons/home2.png')
              : require('../assets/icons/home.png');
          } else if (rn === profileName) {
            iconUri = focused
              ? require('../assets/icons/user2.png')
              : require('../assets/icons/user.png');
          } else if (rn === announcements) {
            iconUri = focused
              ? require('../assets/icons/chat2.png')
              : require('../assets/icons/chat.png');
          } else if (rn === leaderboard) {
            iconUri = focused
              ? require('../assets/icons/leaderboard2.png')
              : require('../assets/icons/leaderboard.png');
          } else if (rn === calendar) {
            iconUri = focused
              ? require('../assets/icons/calendar2.png')
              : require('../assets/icons/calendar.png');
          }
          return (
            <Image
              source={iconUri}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />
          );
        },
      })}
      tabBarOptions={{
        tabStyle: {
          display: 'flex',
        },
        labelStyle: {
          paddingBottom: 10,
          fontSize: 10,
        },
      }}>
      <Tab.Screen name={leaderboard} component={Leaderboard} />
      <Tab.Screen name={calendar} component={CalendarPage} />
      <Tab.Screen name={homeName} component={HomeScreen} />
      <Tab.Screen name={announcements} component={Announcements} />
      <Tab.Screen name={profileName} component={ProfileScreen} />
    </Tab.Navigator>
  );
}
