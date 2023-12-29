/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import type {PropsWithChildren} from 'react';
import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Linking,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// Importing different screens
import MainPage from './navigation/MainPage';
import LoginScreen from './navigation/screens/Login/LoginScreen';
import LoginInputScreen from './navigation/screens/z_Extra Screens/LoginInputScreen';
import MessageScreen from './navigation/screens/z_Extra Screens/MessageScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import GameSummary from './navigation/screens/Games/GameSummary';
import AddGame from './navigation/screens/Games/AddGame';
import EditGame from './navigation/screens/Games/EditGame';
import EnterResults from './navigation/screens/Games/EnterResults';
import GameHistory from './navigation/screens/Games/GameHistory';
import AnnouncementMessages from './navigation/screens/Announcements/AnnouncementMessages';
import FullMessage from './navigation/screens/Announcements/FullMessage';
import SplashScreen from './navigation/screens/SplashScreen';

// Creating a stack navigator
const Stack = createStackNavigator();
/**
 * App Component
 *
 * The root component of the React Native application.
 * It sets up a stack navigator for navigating between different screens of the app.
 * The app includes screens like login, main page, game summary, and more.
 *
 * @returns {React.Component} - The App component with navigation setup.
 */
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const handleOpenURL = event => {
      console.log('Incoming URL:', event.url);

      // Example: Extract info from URL and navigate
      const parsedUrl = new URL(event.url);

      // Assuming the deep link is something like 'myapp://authenticated?token=abc123'
      if (parsedUrl.pathname === '/authenticated') {
        const token = parsedUrl.searchParams.get('token');
        // Here you can handle the token, store it, and navigate
        console.log('Received token:', token);
        // Example: navigate to the 'Main' screen in your navigator
        // You need to ensure you have a reference to your navigation object here
        navigation.navigate('Main');
      }
    };

    Linking.getInitialURL().then(url => {
      if (url) {
        handleOpenURL({url});
      }
    });

    const urlSubscription = Linking.addEventListener('url', handleOpenURL);

    // Get the initial URL in case the app is opened via a deep link
    Linking.getInitialURL().then(url => {
      if (url) {
        console.log('here');
        handleOpenURL({url});
      }
    });

    // Clean up the event listener
    return () => {
      if (urlSubscription) {
        urlSubscription.remove();
      }
    };
  }, []);

  return (
    //<SafeAreaView style={backgroundStyle}>
    //<MainPage/>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerTitle: 'Login',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Main"
          component={MainPage}
          options={{
            headerTitle: 'Main',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="LoginInput"
          component={LoginInputScreen}
          options={{
            headerTitle: 'LoginInput',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="GameSummary"
          component={GameSummary}
          options={{
            headerTitle: 'GameSummary',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MessageScreen"
          component={MessageScreen}
          options={{
            headerTitle: 'MessageScreen',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddGame"
          component={AddGame}
          options={{
            headerTitle: 'AddGame',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditGame"
          component={EditGame}
          options={{
            headerTitle: 'EditGame',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EnterResults"
          component={EnterResults}
          options={{
            headerTitle: 'EnterResults',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="GameHistory"
          component={GameHistory}
          options={{
            headerTitle: 'GameHistory',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AnnouncementMessages"
          component={AnnouncementMessages}
          options={{
            headerTitle: 'Announcement Messages',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FullMessage"
          component={FullMessage}
          options={{
            headerTitle: 'Full Message',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    //</SafeAreaView>
  );

  /*
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="IMYale">
            This is a test app for IMYale!
          </Section>
          <Section title="Events placed below">
            Hey!!!
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
  */
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
