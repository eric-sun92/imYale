import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ScrollView} from 'react-native-gesture-handler';
// import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import {apiURL} from '../../../global.js';

/**
 * EnterResults Component
 *
 * This component is used for entering and submitting the scores of a game.
 * It allows the user to update scores for both participating teams and determines the winner based on the scores entered.
 * On submission, it updates the game results on the backend and navigates to the 'GameSummary' page.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.route - Route object containing initial game data and parameters.
 * @param {Object} props.navigation - Navigation object for screen transitions.
 * @returns {JSX.Element} - Rendered component for entering game results.
 */
const EnterResults = ({route, navigation}) => {
  // Destructuring route parameters for initial game details
  const {
    gameID,
    team1,
    team2,
    scoreHome,
    scoreAway,
    team1Users,
    team2Users,
    sport,
    date,
  } = route.params;

  // State variables for managing scores
  const [scoreHomeNew, setScoreHome] = useState(scoreHome);
  const [scoreAwayNew, setScoreAway] = useState(scoreAway);

  let colleges = [team1, team2];
  // Mapping team abbreviations to full names
  const swappedCollegeDictionary = {
    BF: 'Benjamin Franklin',
    BR: 'Branford',
    DP: 'Davenport',
    GH: 'Grace Hopper',
    JE: 'Jonathan Edwards',
    MO: 'Morse',
    PM: 'Pauli Murray',
    PS: 'Pierson',
    SY: 'Saybrook',
    SM: 'Silliman',
    TD: 'Timothy Dwight',
    TR: 'Trumbull',
    BK: 'Berkeley',
    ES: 'Ezra Stiles',
  };
  /**
   * Handles the submission of the updated game scores.
   * Determines the winner based on the scores and updates the game details via API.
   */
  const handleSubmit = () => {
    // Defaulting the winner to a tie
    let winnerNew = 'tie';
    // Determining the winner based on the scores entered
    if (scoreAwayNew > scoreHomeNew) {
      winnerNew = team2;
    } else if (scoreHomeNew > scoreAwayNew) {
      winnerNew = team1;
    }

    // Preparing the updated game data
    const gameData = {
      gameID: gameID,
      team1: team1,
      team2: team2,
      scoreHome: scoreHomeNew,
      scoreAway: scoreAwayNew,
      winner: winnerNew,
      team1Users: team1Users,
      team2Users: team2Users,
      sport: sport,
      date: date,
      completed: true,
    };
    id = gameID;
    // API call to update the game with the new scores and winner
    axios
      .put(`${apiURL}/api/game/${id}`, gameData)
      .then(response => {
        // Navigate to the 'Main' screen upon successful update
        navigation.replace('Main');
      })
      .catch(error => {
        // Handle any errors during the API call
        console.log(error);
      });
  };
  /**
   * Navigates back to the Game Summary page without submitting the scores.
   */
  const backToMain = () => {
    const gameData = {
      gameID: gameID,
    };

    navigation.replace('GameSummary', gameData);
  };

  return (
    <View style={styles.backContainer}>
      <View style={styles.headContainer}>
        <TouchableOpacity style={styles.back} onPress={backToMain}>
          <Image
            source={require('../../../assets/utils/back.png')}
            style={{width: 20, height: 20}}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.pageTextContainer}>
          <Text style={styles.pageText}>Edit Game</Text>
        </View>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View style={[styles.itemContainer, {borderColor: '#9e8100'}]}>
            <View style={[styles.textContainer, {backgroundColor: '#9e8100'}]}>
              <Text style={styles.headText}>Enter Scores:</Text>
            </View>
            <TextInput
              style={styles.input}
              onChangeText={inputText => setScoreHome(inputText)}
              value={scoreHomeNew}
              placeholder={swappedCollegeDictionary[team1] + ' Score'}
            />
            <TextInput
              style={styles.input}
              onChangeText={inputText => setScoreAway(inputText)}
              value={scoreAwayNew}
              placeholder={swappedCollegeDictionary[team2] + ' Score'}
            />
          </View>
          <View style={styles.spacing}></View>
        </View>
        <Button title="Submit Game" onPress={handleSubmit} />

        <View style={styles.spacing}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  backContainer: {
    padding: 20,
    marginVertical: 30,
    position: 'relative',
  },

  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  pageTextContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    left: '30%',
    right: '30%',
    top: '40%',
  },
  pageText: {
    fontFamily: 'Helvetica Neue',
    textAlign: 'center',
    fontSize: 18,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    marginBottom: 40,
  },
  textContainer: {
    backgroundColor: '#00356B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  headText: {
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    padding: 10,
    color: 'white',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  back: {
    marginVertical: 20,
  },
  dateTimePicker: {
    marginTop: 10,
    marginBottom: 15,
  },
  itemContainer: {
    borderWidth: 2,
    borderColor: '#00356B',
    borderRadius: 20,
  },
  spacing: {
    height: 20,
  },
});

export default EnterResults;
