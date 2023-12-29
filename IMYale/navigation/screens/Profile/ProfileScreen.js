import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Button,
  toggleDropdown,
} from 'react-native';
import MatchBlock from '../../components/MatchBlock v3';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiURL} from '../../../global.js';

/**
 * ProfileScreen Component
 *
 * Displays the user's profile information including their participation in sports games.
 * The screen allows users to view their win/loss ratio, number of games played, and filter games by sport.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.navigation - Navigation object for screen transitions.
 * @returns {React.Component} - The ProfileScreen component.
 */
export default function ProfileScreen({navigation}) {
  // State variables for user data and game filtering

  const [userName, setUserName] = useState('');
  const [userResCo, setUserResCo] = useState('');
  const [userNetID, setUserNetID] = useState('');
  const [userYear, setUserYear] = useState('');

  const [selectedSport, setSelectedSport] = useState('all');
  const [filteredGameData, setFilteredGameData] = useState([]);

  const [winLossRatio, setWinLossRatio] = useState('N/A');
  const [numGamesPlayed, setNumGamesPlayed] = useState('0');

  const [resImg, setResImg] = useState('');

  // Image mappings for residential colleges
  const swappedDictionary = {
    'Benjamin Franklin': 'BF',
    Branford: 'BR',
    Davenport: 'DP',
    'Grace Hopper': 'GH',
    'Jonathan Edwards': 'JE',
    Morse: 'MO',
    'Pauli Murray': 'PM',
    Pierson: 'PS',
    Saybrook: 'SY',
    Silliman: 'SM',
    'Timothy Dwight': 'TD',
    Trumbull: 'TR',
    Berkeley: 'BK',
    'Ezra Stiles': 'ES',
  };
  // Dictionary to map college abbreviations to full names
  const resImages = {
    BF: require('../../../assets/colleges/BF.png'),
    BK: require('../../../assets/colleges/BK.png'),
    BR: require('../../../assets/colleges/BR.png'),
    DP: require('../../../assets/colleges/DP.png'),
    ES: require('../../../assets/colleges/ES.png'),
    GH: require('../../../assets/colleges/GH.png'),
    JE: require('../../../assets/colleges/JE.png'),
    MO: require('../../../assets/colleges/MO.png'),
    MY: require('../../../assets/colleges/MY.png'),
    PM: require('../../../assets/colleges/PM.png'),
    PS: require('../../../assets/colleges/PS.png'),
    SM: require('../../../assets/colleges/SM.png'),
    SY: require('../../../assets/colleges/SY.png'),
    TD: require('../../../assets/colleges/TD.png'),
    TR: require('../../../assets/colleges/TR.png'),
  };

  /**
   * Fetch user data and games on component mount.
   */
  useEffect(() => {
    // Fetch user data
    axios
      .get(`${apiURL}/api/user/getUser`, {withCredentials: true})
      .then(response => {
        const user = response.data.user;
        setUserResCo(swappedDictionary[user.college]);
        setUserName(`${user.first_name} ${user.last_name}`);
        setUserNetID(user.netid);
        setUserYear(user.year.slice(2));
        setResImg(resImages[swappedDictionary[user.college]]);
      })
      .catch(err => {
        console.log(err);
      });
    // Fetch games the user has participated in
    axios
      .get(`${apiURL}/api/games/userAll`, {withCredentials: true})
      .then(response => {
        filterAndSortGames(response.data.games, selectedSport);
        console.log(response.data.games);
      })
      .catch(err => {
        console.log(err);
      });
  }, [selectedSport]);
  /**
   * Filters and sorts games based on the selected sport.
   * Calculates win/loss ratio and number of games played.
   * @param {Array} games - Array of game objects to be filtered.
   * @param {string} sport - Selected sport for filtering.
   */
  const filterAndSortGames = (games, sport) => {
    let filteredAndSorted;
    if (sport === 'all') {
      filteredAndSorted = games.sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );
    } else {
      filteredAndSorted = games
        .filter(game => game.sport === sport)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    total = 0;
    wins = 0;
    filteredAndSorted.forEach(game => {
      if (game.winner) {
        total += 1;
        if (game.winner == userResCo) {
          wins += 1;
        }
      }
    });
    setWinLossRatio(wins / total);
    setNumGamesPlayed(filteredAndSorted.length);
    setFilteredGameData(filteredAndSorted);
  };

  /**
   * Handles user logout, clears AsyncStorage and navigates to the login screen.
   */
  const handleLogout = () => {
    AsyncStorage.removeItem('cookies');
    // remove the cookie from axios
    axios.defaults.headers.Cookie = '';
    navigation.navigate('Login');
  };

  // const handleLogout = async () => {
  //   // Call backend API to handle CAS logout
  //   try {
  //     await axios.get(`${apiURL}/api/auth/cas/logout`);
  //     // Clear cookies from AsyncStorage
  //     await AsyncStorage.removeItem('cookies');
  //     // Reset the axios cookie header
  //     axios.defaults.headers.Cookie = '';
  //     // Navigate back to the login screen
  //     navigation.navigate('Login');
  //   } catch (error) {
  //     console.error('Logout failed:', error);
  //   }
  // };

  return (
    <View style={{flex: 1, paddingVertical: 10}}>
      <TouchableOpacity style={styles.addButton} onPress={handleLogout}>
        <Image
          source={require('../../../assets/utils/logout.png')}
          style={styles.addIcon}
        />
      </TouchableOpacity>

      <View style={styles.topHalf}>
        <View style={styles.profileBio}>
          <Text style={styles.name}>{userName}</Text>
          {/* <Text style={styles.info}>{userNetID}</Text> */}
          <Text style={styles.info}>
            {userResCo} '{userYear}
          </Text>
          <Image source={resImg} style={styles.resImg} resizeMode="contain" />
        </View>
        <View style={styles.rightTop}>
          <Text style={styles.wlratio}>W/L Ratio: {winLossRatio}</Text>
          <Text style={styles.wlratio}>Num Games Played: {numGamesPlayed}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownOpener}>
        <Text style={styles.titleText}>Games Participated In</Text>
        <Text style={styles.dropdownOpenerText}>Select Sport Below</Text>
        {/* <Image
                    source={require('../../assets/down-arrow.png')} // Replace with your icon's path
                    style={styles.dropdownArrow}
                /> */}
      </TouchableOpacity>

      <View style={styles.dropdown}>
        <RNPickerSelect
          onValueChange={value => setSelectedSport(value)}
          items={[
            {label: 'All Games', value: 'all'}, // Added 'All Games' option
            {label: 'Basketball', value: 'basketball'},
            {label: 'Football', value: 'football'},
            {label: 'Volleyball', value: 'volleyball'},
            {label: 'Soccer', value: 'soccer'},
            {label: 'Badminton', value: 'badminton'},
            {label: 'Cornhole', value: 'cornhole'},
            {label: 'Dodgeball', value: 'dodgeball'},
            {label: 'Broomball', value: 'broomball'},
            {label: 'Pickleball', value: 'pickleball'},
            {label: 'Ping Pong', value: 'pingpong'},
            {label: 'Volleyball', value: 'volleyball'},
            {label: 'Waterpolo', value: 'waterpolo'},
          ]}
          value={selectedSport}
          style={{
            inputIOS: styles.pickerStyleIOS,
            inputAndroid: styles.pickerStyleAndroid,
          }}
        />
      </View>

      <ScrollView>
        {filteredGameData.map((block, index) => (
          <MatchBlock key={index} {...block} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    right: 6,
    top: 21,
    borderRadius: 25,
    padding: 10,
    zIndex: 1,
  },
  topHalf: {
    display: 'flex',
    flexDirection: 'row',
  },
  profileBio: {
    margin: 6,
    paddingLeft: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'Helvetica Neue',
  },
  info: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
    fontFamily: 'Helvetica Neue',
  },
  rightTop: {
    marginTop: 30,
    marginLeft: 20,
  },
  addButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    borderRadius: 25,
    padding: 10,
    zIndex: 1,
  },
  addIcon: {
    width: 16,
    height: 16,
  },
  dropdownOpener: {
    marginTop: -10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    borderRadius: 5,
    fontSize: 10,
  },
  dropdownOpenerText: {
    fontSize: 13,
    marginRight: 10,
    fontFamily: 'Helvetica Neue',
  },
  titleText: {
    fontSize: 15,
    marginRight: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  dropdown: {
    marginHorizontal: 50,
    marginTop: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    // Additional styling if needed
  },
  pickerStyleIOS: {
    fontSize: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    color: 'black',
    // to ensure the text is never behind the icon
    fontFamily: 'Helvetica Neue',
    textAlign: 'center',
  },
  pickerStyleAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  historyButton: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#00356B',
  },
  historyText: {
    color: '#00356B',
    textAlign: 'center',
    fontSize: 20,
  },
  wlratio: {
    margin: 10,
    fontWeight: '600',
  },
  resImg: {
    marginTop: 1,
    marginLeft: -5,
    width: 60,
    height: 60,
  },
});
