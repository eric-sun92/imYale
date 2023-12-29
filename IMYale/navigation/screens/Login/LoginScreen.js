import React, {useState, createRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from 'react-native-elements';
import {WebView} from 'react-native-webview';
import CookieManager from '@react-native-cookies/cookies';
import axios from 'axios';
import {apiURL} from '../../../global.js';

/**
 * LoginScreen Component
 *
 * This component is responsible for handling user authentication using a WebView to load a CAS login page.
 * Upon successful login, the user's session is stored, and the user is navigated to the main part of the application.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.navigation - Navigation object for screen transitions.
 * @returns {React.Component} - The LoginScreen component.
 */
const LoginScreen = ({navigation}) => {
  // State to manage the display of the WebView and loading status
  const [showWebView, setShowWebView] = useState(false);
  const [webViewRef, setWebViewRef] = useState(createRef());
  const [loading, setLoading] = useState(true);

  /**
   * Function to handle the display of the CAS login WebView.
   */
  const handleLoginWithCAS = () => {
    // Display the WebView for CAS login
    setShowWebView(true);
  };
  /**
   * On component mount, check if the user is already authenticated by looking for cookies.
   * If authenticated, navigate to the main screen; otherwise, display the login option.
   */
  useEffect(() => {
    const actions = async () => {
      const cookies = await AsyncStorage.getItem('cookies');
      if (cookies) {
        axios.defaults.headers.Cookie = cookies;
      }
      axios
        .get(`${apiURL}/api/user`, {
          withCredentials: true,
        })
        .then(response => {
          if (response.data.user) {
            navigation.replace('Main');
          } else {
            setLoading(false);
          }
        })
        .catch(error => {
          console.log('There was a problem with the request:', error);
          setLoading(false);
        });
    };
    actions();
  }, []);
  /**
   * Handle navigation state changes in the WebView.
   * Used to detect successful login and to extract user data from the URL.
   */
  const handleWebViewNavigationStateChange = newNavState => {
    // if (webViewRef.current) {
    //     webViewRef.current.injectJavaScript(CHECK_COOKIE);
    //   }

    const {url} = newNavState;
    if (url.includes(`${apiURL}/userdata?data=`)) {
      const encodedUserData = url.split('data=')[1];
      const userData = JSON.parse(decodeURIComponent(encodedUserData));

      console.log('User Data:', userData);

      setShowWebView(false); // Hide the WebView
      navigation.replace('Main');
    }
  };
  // Render the login screen view
  const renderLoginScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>imYale</Text>
      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#" />
        ) : (
          <Button
            testID="loginButton"
            title="Sign In With CAS"
            onPress={handleLoginWithCAS}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />
        )}
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 52,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 8,
    },
    buttonContainer: {
      marginBottom: 40,
    },
    button: {
      width: 150,
      height: 40,
      backgroundColor: 'black',
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 15,
    },
  });

  const testOnMessage = async event => {
    const {data} = event.nativeEvent;

    console.log('RECIEVED COOKIE');

    if (data.includes('Cookie:')) {
      // process the cookies
      const storedCookies = await CookieManager.get(`${apiURL}`, true);
      console.log('Cookie: ', storedCookies);
      // store the cookies in AsyncStorage
      await AsyncStorage.setItem('cookies', storedCookies);
    }
  };

  const renderWebView = () => (
    <WebView
      testID="web-view"
      source={{uri: `${apiURL}/api/auth/cas/login`}}
      onNavigationStateChange={handleWebViewNavigationStateChange}
      onMessage={testOnMessage}
      style={{flex: 1}}
      ref={webViewRef}
      sharedCookiesEnabled
    />
  );

  return showWebView ? renderWebView() : renderLoginScreen();
};

export default LoginScreen;
