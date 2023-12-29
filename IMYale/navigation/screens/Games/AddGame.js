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
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import {apiURL} from '../../../global.js';

/**
 * Renders a form for editing and submitting game details.
 *
 * This component allows admins to add a game with game information like teams, score, date, and sport type.
 *
 * @param {Object} props - Component props including route and navigation objects.
 * @param {Object} props.navigation - Enables navigation to other screens.
 * @returns {JSX.Element} The reservation form component.
 */
const AddGame = ({navigation}) => {
  // State variables for managing form data
  const [resCo1, setResCo1] = useState('BF');
  const [resCo2, setResCo2] = useState('BF');
  const [date, setDate] = useState(new Date());
  const [sport, setSport] = useState('basketball');
  const [isPlayOff, setIsPlayOff] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  /**
   * Formats a date object into a readable date and time string.
   * @param {Date} date - The date object to format.
   * @returns {Object} - An object with formatted date and time strings.
   */
  function formatDateAndTime(date) {
    const day = new Date(date).getDate().toString().padStart(2, '0');
    const month = (new Date(date).getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = new Date(date).getFullYear();

    const dateString = `${month}/${day}/${year}`;

    let hours = new Date(date).getHours();
    const minutes = new Date(date).getMinutes().toString().padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const timeString = `${hours}:${minutes} ${ampm}`;
    return {dateString, timeString};
  }

  let {dateString, timeString} = formatDateAndTime(date);

  /**
   * Handles the submission of the reservation form.
   * Validates the form data and sends requests to create a game reservation.
   */
  const handleSubmit = () => {
    // Check if the selected residential colleges are the same
    if (resCo1 === resCo2) {
      setModalMessage('Error: Residential colleges cannot be the same');
      setIsModalVisible(true);
      return;
    }
    // Validate that the selected date is in the future
    const now = new Date();
    if (date <= now) {
      setModalMessage('Error: Date must be in the future');
      setIsModalVisible(true);
      return;
    }
    // Function to create a default message related to the announcement of this game
    const createMessage = () => {
      const messageData = {
        text: `New ${sport} game scheduled between ${resCo1} and ${resCo2} on ${timeString}, ${dateString}`,
        visibility: 'public',
      };
      console.log('here');

      return axios.post(`${apiURL}/api/message/addMessage`, messageData);
    };
    // Function to create a new announcement with this game's message
    const createAnnouncement = messageId => {
      const announcementData = {
        messages: [messageId], // Array of message IDs
      };
      return axios.post(`${apiURL}/api/announcement/add`, announcementData);
    };
    // Function to add a new game, linking it with the announcement
    const addGame = announcementId => {
      const gameData = {
        team1: resCo1,
        team2: resCo2,
        scoreHome: 0,
        scoreAway: 0,
        winner: 'None',
        team1Users: [],
        team2Users: [],
        sport: sport,
        date: date,
        completed: false,
        isPlayOff: isPlayOff,
        announcement: announcementId,
      };
      // Send a POST request to add the new game
      axios
        .post(`${apiURL}/api/game/addGame`, gameData)
        .then(response => {
          // On successful game creation, navigate to the main page
          navigation.replace('Main');
        })
        .catch(error => {
          // Handle errors in game creation
          console.error(error);
          setModalMessage('Error: Something went wrong');
          setIsModalVisible(true);
        });
    };

    // Chain the creation of message, announcement, and game
    createMessage()
      .then(response => {
        // Extract the message ID from response and create an announcement
        const messageId = response.data.id;
        return createAnnouncement(messageId);
      })
      .then(response => {
        // Extract the announcement ID from response and add a new game
        const announcementId = response.data.id;
        addGame(announcementId);
      })
      .catch(error => {
        console.error(error);
        setModalMessage('Error: Failed to create message or announcement');
        setIsModalVisible(true);
      });
  };

  /**
   * Navigates back to the main page.
   */
  const backToMain = () => {
    navigation.replace('Main'); // Navigate to the main page.
  };

  return (
    <View style={styles.backContainer}>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <Button title="OK" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>

      <View style={styles.headContainer}>
        <TouchableOpacity style={styles.back} onPress={backToMain}>
          <Image
            source={require('../../../assets/utils/back.png')}
            style={{width: 20, height: 20}}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.pageTextContainer}>
          <Text style={styles.pageText}>Add Game</Text>
        </View>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.spacing}></View>

          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.headText}>Residential College Home:</Text>
            </View>
            <Picker
              testID="rescoPicker1"
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
              testID="rescoPicker2"
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
                value={date}
                mode={'datetime'}
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  setDate(selectedDate || date); // Update the date state to the new selected date
                }}
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
              testID="sportPicker"
              selectedValue={sport}
              onValueChange={itemValue => setSport(itemValue)}>
              <Picker.Item label="All Games" value="all" />
              <Picker.Item label="Basketball" value="basketball" />
              <Picker.Item label="Football" value="football" />
              <Picker.Item label="Volleyball" value="volleyball" />
              <Picker.Item label="Soccer" value="soccer" />
              <Picker.Item label="Badminton" value="badminton" />
              <Picker.Item label="Cornhole" value="cornhole" />
              <Picker.Item label="Dodgeball" value="dodgeball" />
              <Picker.Item label="Broomball" value="broomball" />
              <Picker.Item label="Pickleball" value="pickleball" />
              <Picker.Item label="Ping Pong" value="pingpong" />
              <Picker.Item label="Volleyball" value="volleyball" />
              <Picker.Item label="Waterpolo" value="waterpolo" />
            </Picker>
          </View>

          <View style={styles.spacing}></View>

          {/* Dropdown for isPlayOff */}
          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.headText}>Is Playoff:</Text>
            </View>
            <Picker
              selectedValue={isPlayOff.toString()} // Convert string to boolean when setting the selected value
              onValueChange={itemValue => setIsPlayOff(itemValue === 'true')}>
              <Picker.Item label="False" value="false" />
              <Picker.Item label="True" value="true" />
            </Picker>
          </View>
          <View style={styles.spacing}></View>
          <Button title="Submit Game" onPress={handleSubmit} testID='submitButton' />

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
  },

  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  // Add more styles as needed
});

export default AddGame;
