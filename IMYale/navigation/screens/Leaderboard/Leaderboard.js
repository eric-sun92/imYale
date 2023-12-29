import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
  ScrollView,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import {apiURL} from '../../../global.js';

/**
 * Leaderboard Component
 *
 * Displays a leaderboard of teams based on their wins and losses in various sports.
 * Users can filter the leaderboard by sport, and the leaderboard is updated accordingly.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.navigation - Navigation object for screen transitions.
 * @returns {React.Component} - The Leaderboard component.
 */
export default function Leaderboard({navigation}) {
  // State variables for managing game data and leaderboard
  const [gameData, setGameData] = useState([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Images for residential colleges
  const resImages = {
    BF: require('../../../assets/colleges/BF.png'),
    BK: require('../../../assets/colleges/BK.png'),
    BR: require('../../../assets/colleges/BR.png'),
    DP: require('../../../assets/colleges/DP.png'),
    ES: require('../../../assets/colleges/ES.png'),
    GH: require('../../../assets/colleges/GH.png'),
    JE: require('../../../assets/colleges/JE.png'),
    MO: require('../../../assets/colleges/MO.png'),
    PM: require('../../../assets/colleges/PM.png'),
    PS: require('../../../assets/colleges/PS.png'),
    SM: require('../../../assets/colleges/SM.png'),
    SY: require('../../../assets/colleges/SY.png'),
    TD: require('../../../assets/colleges/TD.png'),
    TR: require('../../../assets/colleges/TR.png'),
  };

  /**
   * Fetches game data on component mount and calculates the initial leaderboard.
   */
  useEffect(() => {
    axios
      .get(`${apiURL}/api/oldgames`)
      .then(response => {
        setGameData(response.data.games);
        calculateLeaderboard(response.data.games, 'all');
      })
      .catch(error => {
        console.log('Error fetching games:', error);
      });
  }, []); // Empty dependency array means this runs only once on component mount



  // when selected sport changes, this will call the calculateLeaderboard function
  useEffect(() => {
    calculateLeaderboard(gameData, selectedSport);
  }, [selectedSport]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  /**
   * Calculates the leaderboard standings based on the games data and the selected sport.
   * @param {Array} games - Array of game objects.
   * @param {string} sport - Selected sport for filtering.
   */
  const calculateLeaderboard = (games, sport) => {
    const standings = {};

    // Initialize standings with all teams from resImages
    Object.keys(resImages).forEach(team => {
      standings[team] = {};
    });

    games.forEach(game => {
      if (sport === 'all' || game.sport === sport) {
        if (game.winner != "tie") {
          const winner = game.scoreHome > game.scoreAway ? game.team1 : game.team2;
          const loser = game.scoreHome > game.scoreAway ? game.team2 : game.team1;

          [winner, loser].forEach(team => {
            if (!standings[team][game.sport]) {
              standings[team][game.sport] = { wins: 0, losses: 0 };
            }
          });

          // keep track of wins and losses of each team by sport in a 2d dictionary
          standings[winner][game.sport].wins += 1;
          standings[loser][game.sport].losses += 1;
        }
        else {
          const team1 = game.team1
          const team2 = game.team2

          if (!standings[team1]) {
            standings[team1] = { wins: 0, losses: 0 };
          }
          if (!standings[team2]) {
            standings[team2] = { wins: 0, losses: 0 };
          }

          standings[team1].wins += 0.5;
          standings[team2].wins += 0.5;
        }

      }
    });

    // get standings for all or given sport
    const filteredStandings = {}
    Object.keys(standings).forEach(team => {
      if (sport === 'all' || standings[team][sport]) {
        filteredStandings[team] = sport === 'all' ? aggregateAllSports(standings[team]) : standings[team][sport];
      }
    });

    const sortedStandings = Object.entries(filteredStandings).sort((a, b) => {
      if (a[1].wins === 0 && a[1].losses === 0) {
        return 1; // Move items with 0 wins and 0 losses to the end
      }
      if (b[1].wins === 0 && b[1].losses === 0) {
        return -1; // Move items with 0 wins and 0 losses to the end
      }

      // Sort first based on wins (descending)
      const winsComparison = b[1].wins - a[1].wins;

      // If wins are equal, sort based on losses (ascending)
      return winsComparison !== 0 ? winsComparison : a[1].losses - b[1].losses;
    });
    //const sortedStandings = Object.entries(standings).sort((a, b) => b[1].wins - a[1].wins);
    setLeaderboardData(sortedStandings);
  };

  // Function to aggregate wins and losses across all sports for a team
  const aggregateAllSports = (sportsData) => {
    return Object.values(sportsData).reduce((acc, curr) => {
      acc.wins += curr.wins;
      acc.losses += curr.losses;
      return acc;
    }, { wins: 0, losses: 0 });
  };
  const showHistory = () => {
    navigation.navigate('GameHistory');
  }

  const colleges = {
    "BR": "Branford",
    "TR": "Trumbull",
    "PS": "Pierson",
    "DP": "Davenport",
    "PM": "Pauli Murray",
    "BF": "Franklin",
    "MO": "Morse",
    "TD": "TD",
    "JE": "JE",
    "ES": "Ezra Stiles",
    "BK": "Berkeley",
    "GH": "Hopper",
    "SY": "Saybrook",
    "SM": "Silliman",
  }

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownOpener}>
        <Text style={styles.dropdownOpenerText}>Select Sport Below</Text>
      </TouchableOpacity>
      <View style={styles.dropdown}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedSport(value)}
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
      <TouchableOpacity onPress={showHistory} style={styles.historyButton}>
        <Text style={styles.historyText}>Match</Text>
        <Text style={styles.historyText}>Results</Text>
        <Image source={require('../../../assets/icons/history.png')} style={styles.historyIcon} />

      </TouchableOpacity>

      <View style={{ paddingLeft: 10, paddingRight: 10 }}>

        <View style={styles.rowContainerTitle}>
          <Text style={styles.index}>TEAM</Text>
          <Text style={styles.wins}>W</Text>
          <Text style={styles.losses}>L</Text>
          <Text style={styles.percentage}>WIN%</Text>
        </View>



        <FlatList
          data={leaderboardData}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 150 }}
          renderItem={({ item, index }) => (
            <View style={[styles.rowContainer,
            index === 0 ? { backgroundColor: '#FFD97D' } : null,
            index === 1 ? { backgroundColor: '#dedede' } : null,
            index === 2 ? { backgroundColor: '#AE8D6A' } : null,
            (item[1].wins === 0 && item[1].losses === 0) ? { backgroundColor: 'white' } : null]}>
              <Text style={styles.index}>
                {item[1].wins === 0 && item[1].losses === 0 ? '-' : index + 1}
              </Text>
              <Image source={resImages[item[0]]} style={styles.teamImage} />

              <Text style={styles.teamName}>{colleges[item[0]]}</Text>
              <Text style={styles.wins}>{item[1].wins}</Text>
              <Text style={styles.losses}>{item[1].losses}</Text>

              <Text style={styles.percentage}>
                {isNaN(item[1].wins / (item[1].wins + item[1].losses))
                  ? 'NaN'
                  : (item[1].wins / (item[1].wins + item[1].losses)).toFixed(2) === '1.00'
                    ? '1.00'
                    : (item[1].wins / (item[1].wins + item[1].losses)).toFixed(3).substring(1)}
              </Text>
            </View>
          )}
        />
        <View style={styles.spacer} />

      </View>

    </View>

  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
  },
  index: {
    fontWeight: 'bold',
    marginRight: 10,
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
  rowContainerTitle: {
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 20,
    marginVertical: 0,

    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 2,
    borderRadius: 5,
  },

  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 0,
    marginVertical: 5,
    borderRadius: 5,
    position: 'absolute',
    left: '25%',
  },
  teamName: {
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
    position: 'absolute',
    left: '30%',
  },
  stat: {
    flex: 1,
    textAlign: 'center',
    position: 'absolute',
    left: '50%',
  },
  wins: {
    flex: 1,
    textAlign: 'center',
    position: 'absolute',
    left: '65%',
  },
  losses: {
    flex: 1,
    textAlign: 'center',
    position: 'absolute',
    left: '79%',
  },
  percentage: {
    textAlign: 'right',
    position: 'absolute',
    left: '93%',
  },
  teamImage: {
    position: 'absolute',
    left: '15%',
    width: 28,
    height: 28,
    marginRight: 10,
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

  spacer: {
    height: 100, // Adjust the height as needed
  },

  historyButton: {
    position: 'absolute',
    top: -7,
    right: 0,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 10,
    borderRadius: 10,
  },
  historyIcon: {
    width: 25,
    height: 25,
    marginRight: 0,
  },
  historyText: {
    color: 'grey',
    fontSize: 10,
  },
});
