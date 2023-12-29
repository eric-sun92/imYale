import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {apiURL, approvedRole} from '../../../global.js';

import MatchBlockV1 from '../../components/MatchBlock v1.js';
import MatchBlockV2 from '../../components/MatchBlock v2.js';
import MatchBlockV3 from '../../components/MatchBlock v3.js';

import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

/**
 * HomeScreen Component
 *
 * Displays a list of upcoming games and allows users to filter the list by sport.
 * Users can navigate to add a new game or view games related to their residential college.
 *
 * @param {Object} props - The component's properties.
 * @param {Object} props.navigation - Navigation object provided by React Navigation.
 * @returns {React.Component} A React component that renders the home screen.
 */
export default function HomeScreen({navigation}) {
  // State variables for managing games and filters
  const [gameData, setGameData] = useState([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [filteredGameData, setFilteredGameData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [ownCollege, setOwnCollege] = useState('');
  const [role, setRole] = useState('user');
  const [matchBlockVersion, setMatchBlockVersion] = useState(1);
  //   const approvedRole = 'admin';
  // Dictionary to map college abbreviations to full names

  const renderMatchBlock = (block, role, index) => {
    switch (matchBlockVersion) {
      case 1:
        return <MatchBlockV1 key={index} role={role} {...block} />;
      case 2:
        return <MatchBlockV2 key={index} role={role} {...block} />;
      case 3:
        return <MatchBlockV3 key={index} role={role} {...block} />;
      default:
        return <MatchBlockV1 key={index} role={role} {...block} />;
    }
  };
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
  /**
   * Fetches new games and user information on component mount.
   */
  useEffect(() => {
    // console.log(apiURL)

    // Fetch games from the backend

    const fetchMatchBlockVariation = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/api/games/choosematchblockvariation`,
          {
            withCredentials: true,
          },
        );
        setMatchBlockVersion(response.data.variationId);

        console.log(response.data.variationId);
      } catch (error) {
        console.log('Error fetching MatchBlock variation:', error);
      }
    };

    const fetchGames = async () => {
      // const cookieString = await CookieManager.get('http://localhost:4000', true);
      // console.log(cookieString)

      axios
        .get(`${apiURL}/api/newgames`, {
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
    // Fetch user data to determine their college
    const getuser = async () => {
      axios
        .get(`${apiURL}/api/user/getUser`, {
          withCredentials: true,
        })
        .then(response => {
          setOwnCollege(response.data.user.college);
          setRole(response.data.user.user.role);
          //   console.log(response.data.user.user.role);
        })
        .catch(error => {
          console.log('There was a problem with the request:', error);
        });
    };
    fetchMatchBlockVariation();
    getuser();
    fetchGames();
  }, []);

  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    setChecked(!checked);
  };

  /**
   * Filters and sorts games based on the selected sport.
   * @param {Array} games - The array of games to be filtered.
   * @param {string} sport - The selected sport for filtering.
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
  /**
   * Filters and sorts games based on the selected sport and user's residential college.
   * @param {Array} games - The array of games to be filtered.
   * @param {string} sport - The selected sport for filtering.
   * @param {string} ownResco - The user's residential college for additional filtering.
   */
  const filterAndSortGames2 = (games, sport, ownResco) => {
    let filteredAndSorted;
    if (sport === 'all') {
      filteredAndSorted = games
        .filter(
          game =>
            game.team1 === swappedDictionary[ownResco] ||
            game.team2 === swappedDictionary[ownResco],
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      filteredAndSorted = games
        .filter(
          game =>
            (game.team1 === swappedDictionary[ownResco] ||
              game.team2 === swappedDictionary[ownResco]) &&
            game.sport === sport,
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    setFilteredGameData(filteredAndSorted);
  };

  // filteredAndSorted = games
  // .filter(game => game.team1 === ownresco || game.team2 === ownresco)

  // Re-filter games when the selected sport or game data changes
  useEffect(() => {
    if (checked) {
      filterAndSortGames2(gameData, selectedSport, ownCollege);
    } else {
      filterAndSortGames(gameData, selectedSport);
    }
  }, [selectedSport, checked]);
  /**
   * Toggles the state to show or hide the dropdown for sport selection.
   */
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  /**
   * Navigates to the AddGame screen.
   */
  const newGame = () => {
    navigation.replace('AddGame');
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownOpener}>
        <Text style={styles.dropdownOpenerText}>Select Sport Below</Text>
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
      {role == approvedRole && (
        <TouchableOpacity style={styles.addButton} onPress={newGame}>
          <Image
            source={require('../../../assets/utils/plus.png')}
            style={styles.addIcon}
          />
        </TouchableOpacity>
      )}

      <TouchableWithoutFeedback onPress={handleToggle}>
        <View>
          <Text style={styles.label}>Filter</Text>
          <Text style={styles.label2}>ResCo</Text>

          <View>
            {checked ? (
              <Image
                source={require('../../../assets/utils/checked2.png')}
                style={styles.addButton2}
              />
            ) : (
              <Image
                source={require('../../../assets/utils/checked.png')}
                style={styles.addButton2}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>

      <ScrollView>
        {filteredGameData.map((block, index) =>
          renderMatchBlock(block, role, index),
        )}
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
  addButton2: {
    position: 'absolute',
    left: 14,
    top: -22,
    borderRadius: 25,
    padding: 10,
    zIndex: 1,
    width: 10,
    height: 10,
  },
  label: {
    position: 'absolute',
    left: 0,
    top: -58,
    borderRadius: 25,
    padding: 10,
    zIndex: 1,
    fontSize: 10,
  },
  label2: {
    position: 'absolute',
    left: 0,
    top: -46,
    borderRadius: 25,
    padding: 10,
    zIndex: 1,
    fontSize: 10,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
});
