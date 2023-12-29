import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import AnnouncementsBlock from '../../components/AnnouncementsBlock';
import axios from 'axios';
import CookieManager from '@react-native-cookies/cookies';
import RNPickerSelect from 'react-native-picker-select';
import {apiURL} from '../../../global.js';

/**
 * HomeScreen functional component for the main announcements screen of the app.
 * It displays a list of announcemnets blocks generate by game data and allows users to filter announcemtns by sport.
 *
 * @param {Object} props - The component's properties.
 * @param {Object} props.navigation - Navigation object provided by React Navigation.
 * @returns {React.Component} A React component.
 */
export default function AnnouncementsPage({navigation}) {
  // State hooks for managing component data
  const [gameData, setGameData] = useState([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [filteredGameData, setFilteredGameData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Effect hook for fetching game data on component mount
  useEffect(() => {
    const actions = async () => {
      axios
        .get(`${apiURL}/api/games/user`, {
          withCredentials: true,
        })
        .then(response => {
          setGameData(response.data.games);
          filterAndSortGames(response.data.games, selectedSport);
        })
        .catch(error => {
          console.log('There was a problem with the request:', error);
        });
    };
    actions();
  }, []);

  /**
   * Function to filter and sort game data based on the selected sport.
   *
   * @param {Array} games - Array of game objects.
   * @param {string} sport - Selected sport to filter games.
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
    setFilteredGameData(filteredAndSorted);
  };

  // Effect hook to re-filter games when the selected sport changes
  useEffect(() => {
    filterAndSortGames(gameData, selectedSport);
  }, [selectedSport]);

  // Function to toggle the dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Function to navigate to the AddGame screen
  const newGame = () => {
    navigation.replace('AddGame');
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownOpener}>
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
            {label: 'All Sports', value: 'all'}, // Added 'All Games' option
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
          <AnnouncementsBlock key={index} {...block} />
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
    flexDirection: 'row',
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
});
