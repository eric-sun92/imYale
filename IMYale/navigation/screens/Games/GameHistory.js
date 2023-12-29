import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Button,
} from 'react-native';
import MatchBlock from '../../components/MatchBlock v3';
import axios from 'axios';
import CookieManager from '@react-native-cookies/cookies';
import RNPickerSelect from 'react-native-picker-select';
import {apiURL} from '../../../global.js';

/**
 * GameHistory Component
 *
 * This component displays the history of games filtered by a selected sport.
 * It fetches game data from the backend and allows the user to filter games based on sports categories.
 * The user can navigate to other screens like 'AddGame' or 'Leaderboard'.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.navigation - Navigation object for screen transitions.
 * @returns {JSX.Element} - Rendered component for game history.
 */
export default function GameHistory({navigation}) {
  // State variables to manage games data and selected sport
  const [gameData, setGameData] = useState([]);
  const [selectedSport, setSelectedSport] = useState('basketball');
  const [filteredGameData, setFilteredGameData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetching game data on component mount
  useEffect(() => {
    const actions = async () => {
      axios
        .get(`${apiURL}/api/oldgames`, {
          withCredentials: true,
        })
        .then(response => {
          setGameData(response.data.games);
          console.log(response.data.games);
          filterAndSortGames(response.data.games, selectedSport);
        })
        .catch(error => {
          console.log('There was a problem with the request:', error);
        });
    };
    actions();
  }, []);

  /**
   * Filters and sorts games based on the selected sport.
   * @param {Array} games - Array of game objects to be filtered and sorted.
   * @param {string} sport - Selected sport to filter games.
   */
  const filterAndSortGames = (games, sport) => {
    const filteredAndSorted = games
      .filter(game => game.sport === sport)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    setFilteredGameData(filteredAndSorted);
  };

  // Re-filter games when the selected sport or game data changes
  useEffect(() => {
    filterAndSortGames(gameData, selectedSport);
  }, [selectedSport, gameData]);

  //open or close the dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Navigation functions to go to different screens
  const backToLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };

  return (
    <View style={{flex: 1, paddingVertical: 20, marginVertical: 30}}>
      <View style={styles.startContainer}>
        <TouchableOpacity onPress={backToLeaderboard}>
          <Image
            source={require('../../../assets/utils/back.png')}
            style={{width: 20, height: 20}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownOpener}>
        <Text style={styles.titleText}>Game History</Text>
        <Text style={styles.dropdownOpenerText}>Select Sport Below</Text>
        {/* <Image source={require('../../assets/down-arrow.png')} // Replace with your icon's path
                    style={styles.dropdownArrow}
                /> */}
      </TouchableOpacity>

      <View style={styles.dropdown}>
        <RNPickerSelect
          onValueChange={value => setSelectedSport(value)}
          items={[
            {label: 'Basketball', value: 'basketball'},
            {label: 'Football', value: 'football'},
            {label: 'Volleyball', value: 'volleyball'},
            {label: 'Soccer', value: 'soccer'},
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
    right: 10,
    top: 10,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    zIndex: 1,
  },
  addIcon: {
    width: 20,
    height: 20,
  },
  dropdownOpener: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
    fontSize: 25,
    marginRight: 10,
    fontFamily: 'arial',
    marginBottom: 10,
  },

  dropdown: {
    marginHorizontal: 50,
    marginTop: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
  },
  pickerStyleIOS: {
    fontSize: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    color: 'black',
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
    paddingRight: 30,
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
  startContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: 10,
  },
});
