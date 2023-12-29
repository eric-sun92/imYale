import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  toggleDropdown,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {Calendar, LocaleConfig, Agenda} from 'react-native-calendars';
import axios from 'axios';
import MatchBlock from '../../components/MatchBlock v3';
import {apiURL} from '../../../global.js';

/**
 * A page displaying a calendar with match/game details.
 * Users can filter games by sport and view them on selected dates.
 */
const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredGameData, setFilteredGameData] = useState([]);
  const [userResCo, setUserResCo] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');

  const [isLoading, setIsLoading] = useState(false);
  // Dictionary for swapping college names with their abbreviations
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

  useEffect(() => {
    // Fetch user data and game data on component mount
    axios
      .get(`${apiURL}/api/user/getUser`, {withCredentials: true})
      .then(response => {
        const user = response.data.user;
        setUserResCo(swappedDictionary[user.college]);
      })
      .catch(err => {
        console.log(err);
      });

    axios
      .get(`${apiURL}/api/games/userAll`, {withCredentials: true})
      .then(response => {
        filterAndSortGames(response.data.games, selectedSport);
      })
      .catch(err => {
        console.log(err);
      });
  }, [selectedSport]);

  /**
   * Filters and sorts games based on the selected sport and organizes them by date.
   * @param {Array} games - Array of game objects to be filtered and sorted.
   * @param {string} sport - The sport to filter games by.
   */
  const filterAndSortGames = (games, sport) => {
    let filteredAndSorted;
    let gamesByDate = {};
    if (sport === 'all') {
      filteredAndSorted = games.sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );
    } else {
      filteredAndSorted = games
        .filter(game => game.sport === sport)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    filteredAndSorted.forEach(game => {
      // Transform date to 'YYYY-MM-DD'
      const date = game.date.split('T')[0];
      if (!gamesByDate[date]) {
        gamesByDate[date] = [];
      }
      gamesByDate[date].push(game);
    });
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

    setFilteredGameData(gamesByDate);
  };
  /**
   * Renders each game item in the calendar.
   * @param {object} item - The game item to render.
   * @returns {React.Component} - Rendered component for each game.
   */
  const renderItem = item => {
    // Check if the item list is empty
    if (!item || item.length === 0) {
      return (
        <View style={styles.emptyDate}>
          <Text>No games scheduled for this day.</Text>
        </View>
      );
    }

    return <MatchBlock key={1} {...item} />;
  };

  /**
   * Function to handle the loading of items for a selected month in the calendar.
   * @param {object} month - The month for which items are to be loaded.
   */
  const loadItemsForMonth = month => {
    setIsLoading(true); // Set loading to true when loading starts

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false); // Set loading to false when loading is complete
    }, 1000);
  };

  return (
    <View style={styles.container}>
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
      <Agenda
        items={filteredGameData}
        loadItemsForMonth={loadItemsForMonth}
        selected={new Date()}
        renderItem={renderItem}
        rowHasChanged={(r1, r2) => r1._id !== r2._id}
        renderEmptyData={() =>
          isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <View style={styles.emptyDataContainer}>
              <Text style={styles.emptyDataText}>No games scheduled.</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
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
    marginBottom: 5,
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
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#666', // You can choose any color
  },
  emptyDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  emptyDataText: {
    fontSize: 16,
    color: '#666', // You can choose any color
    fontStyle: 'italic',
  },
});

export default CalendarPage;
