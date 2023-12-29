import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import {Button} from 'react-native-elements';
import axios from 'axios';
import Modal from 'react-native-modal';
import {apiURL, approvedRole} from '../../../global.js';

/**
 * GameSummary Component
 *
 * Displays a summary of a specific game including teams, scores, and participants.
 * Allows users to sign up for a game, edit game details, or enter game results.
 * It fetches game details from the backend and updates them as needed.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.route - Route object containing the gameID and other game details.
 * @param {Object} props.navigation - Navigation object for screen transitions.
 * @returns {JSX.Element} - Rendered component for the game summary.
 */
const GameSummary = ({route, navigation}) => {
  const {gameID} = route.params;

  // State variables for managing game details

  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);
  const [resCo1, setResCo1] = useState('');
  const [resCo2, setResCo2] = useState('');
  const [timeStr, setTime] = useState(timeString);
  const [dateStr, setDate] = useState(dateString);
  const [sportStr, setSport] = useState('');
  const [date, setDateR] = useState('');
  const [scoreHome, setScoreHome] = useState(0);
  const [scoreAway, setScoreAway] = useState(0);
  const [winner, setWinner] = useState('');
  const [completed, setCompleted] = useState(false);
  const [role, setRole] = useState('user');

  const [buttonText, setButtonText] = useState('Sign Up');
  // Mapping of residential colleges and sports to their respective images
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

  const sportImages = {
    basketball: require('../../../assets/sports/basketball.png'),
    football: require('../../../assets/sports/football.png'),
  };

  const [imgURL1, setImgURL1] = useState(resImages[resCo1]);
  const [imgURL2, setImgURL2] = useState(resImages[resCo2]);
  const [sportURL, setSportURL] = useState(sportImages[sportStr]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  // Fetching game data on component mount
  useEffect(() => {
    // Make an API request to fetch details for the specific game using its ID
    axios
      .get(`${apiURL}/api/game/${gameID}`, {withCredentials: true})
      .then(response => {
        // The response contains the game's data which is used to update various state variables
        setTeamAPlayers(response.data.game.team1Users);
        setTeamBPlayers(response.data.game.team2Users);
        setResCo1(response.data.game.team1);
        setResCo2(response.data.game.team2);
        setSport(response.data.game.sport);
        setDateR(response.data.game.date);
        setScoreAway(response.data.game.scoreAway);
        setScoreHome(response.data.game.scoreHome);
        setWinner(response.data.game.winner);
        // Setting the image URLs for the teams and sport based on the game data
        setImgURL1(resImages[response.data.game.team1]);
        setImgURL2(resImages[response.data.game.team2]);
        setSportURL(sportImages[response.data.game.sport]);
        // Formatting the date and time for display
        const {dateString, timeString} = formatDateAndTime(
          response.data.game.date,
        );
        setTime(timeString);
        setDate(dateString);
        setCompleted(response.data.game.completed);

        let teamA = response.data.game.team1Users;
        let teamB = response.data.game.team2Users;
        // Determine if the current user is already signed up for the game
        axios
          .get(`${apiURL}/api/user/getUser`, {withCredentials: true})
          .then(response => {
            const user = response.data.user;
            const playerSignedUp =
              teamA.find(player => player[1] === user.netid) ||
              teamB.find(player => player[1] === user.netid);
            setRole(user.user.role);
            // console.log(user.user.role);
            setButtonText(playerSignedUp ? 'Unsign Up' : 'Sign Up');
          })
          .catch(error => {
            console.log('Error:', error.message);
          });
      })
      .catch(error => {
        console.log('There was a problem with the request:', error);
      });
  }, []);
  // Formatting date and time utility function
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

  const {dateString, timeString} = formatDateAndTime(date);

  const [editText, setEditText] = useState('Edit Game');
  let isAdmin = true;

  const [editMode, setEditMode] = useState(false);

  // Handlers for various actions such as editing, signing up, and removing games
  const handleEdit = () => {
    //setting up game info and passing it to the edit game screen
    const gameData = {
      gameID: gameID,
      team1: resCo1,
      team2: resCo2,
      scoreHome: scoreHome,
      scoreAway: scoreAway,
      winner: winner,
      team1Users: teamAPlayers,
      team2Users: teamBPlayers,
      sport: sportStr,
      date: date,
      completed: false,
    };
    navigation.navigate('EditGame', gameData);
  };

  const handleResults = () => {
    //setting up game info and passing it to the enter results screen
    const gameData = {
      gameID: gameID,
      team1: resCo1,
      team2: resCo2,
      scoreHome: scoreHome,
      scoreAway: scoreAway,
      winner: winner,
      team1Users: teamAPlayers,
      team2Users: teamBPlayers,
      sport: sportStr,
      date: date,
      completed: false,
    };
    navigation.navigate('EnterResults', gameData);
  };
  // Navigates back to the main screen
  const backToMain = () => {
    navigation.replace('Main');
  };

  /**
   * Handles the user's sign-up or withdrawal from the game.
   *
   * It makes an API call to get the current user's details and then updates the game's participant list.
   * If the user is already signed up, they are removed from the game; otherwise, they are added.
   * After updating the participant list, it makes another API call to update the game data.
   */
  const handleSignUp = () => {
    // Fetching the current user's details
    axios
      .get(`${apiURL}/api/user/getUser`, {withCredentials: true})
      .then(response => {
        const user = response.data.user;

        const gameData = {
          gameID: gameID,
          team1: resCo1,
          team2: resCo2,
          scoreHome: scoreHome,
          scoreAway: scoreAway,
          winner: winner,
          team1Users: teamAPlayers,
          team2Users: teamBPlayers,
          sport: sportStr,
          date: date,
          completed: completed,
        };
        // Checking if the current date is past the game date
        const currentDate = new Date(); // Get the current date and time
        const gameDate = new Date(gameData.date); // Parse the game date string

        if (currentDate > gameDate) {
          setModalMessage('Game has already ended.');
          setIsModalVisible(true);
          return;
        }

        const playerData = [user.first_name, user.netid];

        // Check if the user is already signed up for the game
        const isPlayerSignedUp =
          teamAPlayers.find(player => player[1] === user.netid) ||
          teamBPlayers.find(player => player[1] === user.netid);

        if (isPlayerSignedUp) {
          // Remove the player from the signing up
          const newTeamAPlayers = teamAPlayers.filter(
            player => player[1] !== user.netid,
          );
          const newTeamBPlayers = teamBPlayers.filter(
            player => player[1] !== user.netid,
          );
          setTeamAPlayers(newTeamAPlayers);
          setTeamBPlayers(newTeamBPlayers);
          gameData.team1Users = newTeamAPlayers;
          gameData.team2Users = newTeamBPlayers;
          setButtonText('Sign me up');
        } else {
          // Add the user to the appropriate team based on their college
          if (user.college === swappedCollegeDictionary[gameData.team1]) {
            const newTeamAPlayers = [...teamAPlayers, playerData];
            setTeamAPlayers(newTeamAPlayers);
            gameData.team1Users = newTeamAPlayers;
            setButtonText('Withdraw');
          } else if (
            user.college === swappedCollegeDictionary[gameData.team2]
          ) {
            const newTeamBPlayers = [...teamBPlayers, playerData];
            setTeamBPlayers(newTeamBPlayers);
            gameData.team2Users = newTeamBPlayers;
            setButtonText('Unsign Up');
          } else {
            setModalMessage('Non-residential college members cannot sign up');
            setIsModalVisible(true);
            return;
          }
        }
        // API call to update the game with the new participant list
        axios
          .put(`${apiURL}/api/game/${gameID}`, gameData)
          .then(response => {
            console.log('after signup game data:');
            console.log(response.data);

            //add game to list of games associated with user
            axios
              .put(
                `${apiURL}/api/user/updateUserGames`,
                {gameId: gameID},
                {withCredentials: true},
              )
              .then(response => {
                console.log('User games updated:', response.data);
                // Handle the successful update here
              })
              .catch(error => {
                console.error('Error updating user games:', error);
                // Handle the error case here
              });
          })
          .catch(error => {
            console.log('There was a problem with the request:', error);
          });
      })
      .catch(error => {
        console.log('Error:', error.message);
      });
  };

  //removes the game from the database
  const removeGame = () => {
    axios
      .delete(`${apiURL}/api/game/${gameID}`)
      .then(response => {
        navigation.replace('Main');
      })
      .catch(error => {
        console.log('There was a problem with the request:', error);
      });

    navigation.navigate('GameHistory');

    //TODO: write code to remove the chat linked to this game in the database
  };

  return (
    <ScrollView style={styles.container}>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <Button title="OK" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
      <View style={styles.rowContainer}>
        <View style={styles.startContainer}>
          <TouchableOpacity onPress={backToMain}>
            <Image
              source={require('../../../assets/utils/back.png')}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.endContainer}>
          <View style={styles.editContainer}>
            {role == approvedRole && (
              <TouchableOpacity onPress={handleEdit}>
                <Image
                  source={require('../../../assets/utils/editPencil.png')}
                  style={{width: 15, height: 15}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
          {role == approvedRole && (
            <View style={styles.editContainer}>
              <TouchableOpacity onPress={removeGame}>
                <Image
                  source={require('../../../assets/utils/x.png')}
                  style={{
                    marginLeft: 3,
                    marginBottom: 1,
                    width: 17,
                    height: 17,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.colContainer}>
        <Text style={styles.timeText}>{timeStr}</Text>
        <Text style={styles.dateText}>{dateStr}</Text>
      </View>

      <View style={styles.teamsContainer}>
        <View style={styles.teamIconA}>
          <Image
            source={imgURL1}
            style={{width: 75, height: 75, marginBottom: 5}}
            resizeMode="contain"
          />
          {/* <Icon name='shield' type='font-awesome' color='#2ecc71' size={40} /> */}
          <Text style={styles.teamText}>{resCo1}</Text>
        </View>

        <Image
          source={sportURL}
          style={{width: 35, height: 35, marginTop: 25}}
          resizeMode="contain"
        />

        <View style={styles.teamIconB}>
          <Image
            source={imgURL2}
            style={{width: 75, height: 75, marginBottom: 5}}
            resizeMode="contain"
          />
          <Text style={styles.teamText}>{resCo2}</Text>
        </View>
      </View>
      <Text style={styles.title}>Attendees</Text>

      <View style={styles.playersContainer}>
        <View style={styles.teamAContainer}>
          {teamAPlayers.map((player, index) => (
            <View key={index} style={styles.playerTextContainer}>
              <Text style={styles.playerText}>{player[0]}</Text>
            </View>
          ))}
        </View>

        <View style={styles.teamBContainer}>
          {teamBPlayers.map((player, index) => (
            <View key={index} style={styles.playerTextContainer}>
              <Text style={styles.playerText}>{player[0]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View>
          <Button
            title={buttonText}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
            type="solid"
            onPress={handleSignUp}
          />
        </View>
        {role == approvedRole && (
          <Button
            title="Enter/Change Results"
            buttonStyle={styles.signupButton}
            titleStyle={styles.signupText}
            type="solid"
            onPress={handleResults}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    marginVertical: 30,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  startContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  endContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  teamText: {
    fontSize: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    fontWeight: '500',
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 250,
    marginBottom: 15,
  },
  teamAContainer: {
    flex: 1,
    marginRight: 35,
  },
  teamBContainer: {
    flex: 1,
    marginLeft: 35,
  },
  playerText: {
    textAlign: 'center',
  },
  signupButton: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#00356B',
    width: '90%',
  },
  signupText: {
    color: '#00356B',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 500,
  },
  button: {
    backgroundColor: '#00356B',
    marginHorizontal: 30,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'white',
    width: '90%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 500,
  },
  teamIconA: {
    alignItems: 'center',
  },
  teamIconB: {
    alignItems: 'center',
  },
  editContainer: {
    flexDirection: 'row',
  },
  timeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default GameSummary;
