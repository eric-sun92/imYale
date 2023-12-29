import React, {useState, useEffect} from 'react';
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
 * Renders a form for editing and submitting game details.
 *
 * This component allows updating of game information like teams, score, date, and sport type.
 * It fetches initial data from route parameters and submits updates to the backend on form submission.
 * It also provides navigation to the 'GameSummary' screen with or without saving changes.
 *
 * @param {Object} props - Component props including route and navigation objects.
 * @param {Object} props.route - Contains initial game details and other route parameters.
 * @param {Object} props.navigation - Enables navigation to other screens.
 * @returns {JSX.Element} The reservation form component.
 */
const EditGame = ({route, navigation}) => {
  // Extracting initial values from route parameters
  const {
    gameID,
    team1,
    team2,
    scoreHome,
    scoreAway,
    winner,
    team1Users,
    team2Users,
    sport,
    date,
    completed,
    isPlayOff,
  } = route.params;

  const [resCo1, setResCo1] = useState(team1);
  const [resCo2, setResCo2] = useState(team2);
  // winner and score
  const [resCo3, setResCo3] = useState([]);
  const [text, setText] = useState('');
  // const [time, setTime] = useState("9 PM");
  const [dateNew, setDate] = useState(new Date(date));
  const [sportNew, setSport] = useState(sport);
  const [isPlayOffState, setIsPlayOff] = useState(Boolean(isPlayOff));
  // Effect hook to set the isPlayOff state on initial render
  useEffect(() => {
    // Set the default value of isPlayOff based on the value received from the backend
    setIsPlayOff(Boolean(isPlayOff));
  }, [isPlayOff]);
  /**
   * Handles the submission of the game reservation form.
   * Updates the game data and navigates to the Game Summary page.
   */
  const handleSubmit = () => {
    const gameData = {
      gameID: gameID,
      team1: resCo1,
      team2: resCo2,
      scoreHome: scoreHome,
      scoreAway: scoreAway,
      winner: winner,
      team1Users: [''],
      team2Users: [''],
      sport: sportNew,
      date: dateNew,
      completed: false,
      isPlayOff: isPlayOffState,
    };
    id = gameID;
    // Updating the game details via an API call
    axios
      .put(`${apiURL}/api/game/${id}`, gameData)
      .then(response => {
        console.log(response.data); // Logs the response data from the server
        navigation.replace('Main');
      })
      .catch(error => {
        console.log(error);
      });
    // Navigate to the Game Summary page with updated game data
    navigation.replace('GameSummary', gameData); // Navigate to the main page.
  };

  /**
   * Navigates back to the Game Summary page without saving changes.
   */
  const backToMain = () => {
    const gameData = {
      gameID: gameID,
    };

    navigation.replace('GameSummary', gameData); // Navigate to the main page.
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
          <View style={styles.spacing}></View>
          <View style={styles.spacing}></View>

          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.headText}>Residential College Home:</Text>
            </View>
            <Picker
              selectedValue={resCo1}
              onValueChange={itemValue => setResCo1(itemValue)}>
              <Picker.Item label="Benjamin Franklin" value="BF" />
              <Picker.Item label="Branford" value="BR" />
              <Picker.Item label="Davenport" value="DP" />
              <Picker.Item label="Grace Hopper" value="GH" />
              <Picker.Item label="Jonathan Edwards" value="JE" />
              <Picker.Item label="Morse" value="MO" />
              <Picker.Item label="Pauli Murray" value="PM" />
              <Picker.Item label="Pierson" value="PS" />
              <Picker.Item label="Saybrook" value="SY" />
              <Picker.Item label="Silliman" value="SM" />
              <Picker.Item label="Timothy Dwight" value="TD" />
              <Picker.Item label="Trumbull" value="TR" />
              <Picker.Item label="Berkeley" value="BK" />
              <Picker.Item label="Ezra Stiles" value="ES" />
            </Picker>
          </View>

          <View style={styles.spacing}></View>

          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.headText}>Residential College Away:</Text>
            </View>
            <Picker
              selectedValue={resCo2}
              onValueChange={itemValue => setResCo2(itemValue)}>
              <Picker.Item label="Benjamin Franklin" value="BF" />
              <Picker.Item label="Branford" value="BR" />
              <Picker.Item label="Davenport" value="DP" />
              <Picker.Item label="Grace Hopper" value="GH" />
              <Picker.Item label="Jonathan Edwards" value="JE" />
              <Picker.Item label="Morse" value="MO" />
              <Picker.Item label="Pauli Murray" value="PM" />
              <Picker.Item label="Pierson" value="PS" />
              <Picker.Item label="Saybrook" value="SY" />
              <Picker.Item label="Silliman" value="SM" />
              <Picker.Item label="Timothy Dwight" value="TD" />
              <Picker.Item label="Trumbull" value="TR" />
              <Picker.Item label="Berkeley" value="BK" />
              <Picker.Item label="Ezra Stiles" value="ES" />
            </Picker>
          </View>

          <View style={styles.spacing}></View>
          <View style={styles.itemContainer}>
            <View>
              <View style={styles.textContainer}>
                <Text style={styles.headText}>Choose Date and Time:</Text>
              </View>

              <DateTimePicker
                testID="dateTimePicker"
                value={dateNew}
                mode={'datetime'}
                is24Hour={true}
                display="default"
                onChange={() => setDate(dateNew)}
                style={styles.dateTimePicker}
              />
            </View>
          </View>

          <View style={styles.spacing}></View>

          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.headText}>Sport:</Text>
            </View>
            <Picker
              selectedValue={sportNew}
              onValueChange={itemValue => setSport(itemValue)}>
              <Picker.Item label="Basketball" value="basketball" />
              <Picker.Item label="Soccer" value="soccer" />
              <Picker.Item label="Football" value="football" />
              <Picker.Item label="Volleyball" value="volleyball" />
            </Picker>
          </View>

          <View style={styles.spacing}></View>

          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.headText}>Is Playoff:</Text>
            </View>
            <Picker
              selectedValue={isPlayOffState.toString()} // Convert string to boolean when setting the selected value
              onValueChange={itemValue => setIsPlayOff(itemValue === 'true')}>
              <Picker.Item label="False" value="false" />
              <Picker.Item label="True" value="true" />
            </Picker>
          </View>
          <View style={styles.spacing}></View>
          <Button title="Submit Game" onPress={handleSubmit} />

          <View style={styles.spacing}></View>
        </View>
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
    backgroundColor: '#00356B', // Set the background color
    paddingVertical: 8, // Adjust the padding as needed
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

export default EditGame;
