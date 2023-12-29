import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Icon} from 'react-native-elements';
import axios from 'axios';
import MessageBlock from '../../components/MessagesBlock';
import NewMessage from '../../components/newMessage';
import {apiURL, approvedRole} from '../../../global.js';

/**
 * Represents a screen for displaying and managing announcement messages.
 * Users can view messages related to a specific announcement and add new ones.
 *
 * @param {object} route - The route object containing parameters passed to this screen.
 * @param {object} navigation - Navigation object for screen transitions.
 * @returns {JSX.Element} - The rendered component for the announcement messages screen.
 */
const AnnouncementMessages = ({route, navigation}) => {
  const announcementId = route.params.announcement;
  const [announcement, setAnnouncement] = useState(null);
  const [currentUserCollege, setCurrentUserCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [gameId, setGameId] = useState(null);
  const [role, setRole] = useState('user');
  const [userID, setUserID] = useState('');

  /**
   * Fetches the profile of the current user.
   * Sets the college of the current user which is used for filtering messages.
   */
  const fetchCurrentUserProfile = async () => {
    try {
      const userResponse = await axios.get(`${apiURL}/api/user/getUser`);
      setCurrentUserCollege(userResponse.data.user.college);
      setRole(userResponse.data.user.user.role);
      setUserID(userResponse.data.user.netid);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user data');
    }
  };
  /**
   * Fetches announcement details based on the provided announcement ID.
   * Filters and sorts messages based on the user's college and message visibility.
   */
  const fetchAnnouncement = async () => {
    if (!currentUserCollege) return;

    try {
      const announcementResponse = await axios.get(
        `${apiURL}/api/announcement/${announcementId}`,
      );
      setGameId(announcementResponse.data.announcement.game);
      // console.log("gameId", gameId)
      // console.log("announcement:", announcementResponse.data.announcement);
      let filteredMessages =
        announcementResponse.data.announcement.messages.filter(
          msg =>
            (msg.sender.college === currentUserCollege &&
              msg.visibility == 'private') ||
            msg.visibility == 'public',
        );

      // Sort messages by decreasing order of timestamp
      filteredMessages.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      );

      // console.log("messages:", filteredMessages);
      setAnnouncement(filteredMessages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching announcement:', err);
      setError('Failed to load announcement');
    }
  };

  // This useEffect runs once per page load to fetch the current user's profile.
  useEffect(() => {
    fetchCurrentUserProfile();
  }, []);

  // This useEffect runs whenever the currentUserCollege changes and fetches announcement messages.
  useEffect(() => {
    fetchAnnouncement();
  }, [currentUserCollege]);

  /**
   * Toggles the visibility of the popup for adding a new message.
   */
  const handleAddAnnouncement = () => {
    setPopupVisible(true);
  };
  /**
   * Closes the popup for adding a new message.
   */
  const closePopup = () => {
    setPopupVisible(false);
  };
  /**
   * Handles navigation back to the previous screen.
   */
  const backPage = () => {
    navigation.goBack();
  };
  /**
   * Submits a new message to the announcement.
   * @param {string} text - The text of the message to be submitted.
   */
  const onSubmit = async text => {
    setPopupVisible(false);

    // Function to prepare data for notifications
    // const prepForNotifs = messageData => {
    //   console.log('prep for notifs', messageData);
    //   const swappedCollegeDictionary = {
    //     BF: 'Benjamin Franklin',
    //     BR: 'Branford',
    //     DP: 'Davenport',
    //     GH: 'Grace Hopper',
    //     JE: 'Jonathan Edwards',
    //     MO: 'Morse',
    //     PM: 'Pauli Murray',
    //     PS: 'Pierson',
    //     SY: 'Saybrook',
    //     SM: 'Silliman',
    //     TD: 'Timothy Dwight',
    //     TR: 'Trumbull',
    //     BK: 'Berkeley',
    //     ES: 'Ezra Stiles',
    //   };
    //   console.log('hello', gameId);

    //   const userCollege = currentUserCollege;
    //   //retireve the game data associated with this announcement
    //   axios
    //     .get(`${apiURL}/api/game/${gameId}`, {})
    //     .then(response => {
    //       //parse out the users in the same college as the sender
    //       let usersInSameCollege = [];
    //       if (
    //         swappedCollegeDictionary[response.data.game.team1] == userCollege
    //       ) {
    //         usersInSameCollege = response.data.game.team1Users;
    //       } else {
    //         usersInSameCollege = response.data.game.team2Users;
    //       }
    //       console.log('users in same college', usersInSameCollege);

    //       //TODO: usersInSameCollege is the list of rececipients in format ["First Name", "netId"].
    //       //messageData is the messsage object with sender and text. Write code below to send this to the backend to send notifications to the users in the list
    //     })
    //     .catch(error => {
    //       console.error(error);
    //     });
    // };

    // Function to create a new message, sends in text data and creates a message object with sender and text by sending through the api
    const createMessage = () => {
      const messageData = {
        text: inputValue,
      };
      console.log(messageData);
      return axios.post(`${apiURL}/api/message/addMessage`, messageData);
    };

    // Function to add a message to the announcement, sends in announcementID and messageId to the api
    const addMessageToAnnouncement = (announcementID, messageId) => {
      const data = {
        announcementId: announcementID,
        messageId: messageId,
      };

      return axios.put(`${apiURL}/api/announcement/addMessage`, data);
    };

    // Calls functions to create a message, then add it to the announcement
    createMessage()
      .then(response => {
        // Once message is created, create an announcement with this message ID
        const messageId = response.data.id;
        // prepForNotifs(response.data);
        return addMessageToAnnouncement(announcementId, messageId);
      })
      .then(response => {
        const announcementId = response.data;
        // console.log(announcementId)
        // navigation.replace("AnnouncementMessages", {announcement: announcementId})
        fetchAnnouncement();
      })
      .catch(error => {
        console.error(error);
      });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={backPage} style={styles.startContainer}>
          <Image
            source={require('../../../assets/utils/back.png')}
            style={{width: 20, height: 20}} // Increased size for better touch target
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Announcements</Text>
        {role == approvedRole && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddAnnouncement}>
            <Image
              source={require('../../../assets/utils/plus.png')}
              style={styles.addIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      {announcement.map(msg => (
        <MessageBlock
          userID={userID}
          role={role}
          key={msg._id}
          message={msg}
          fetchAnnouncement={fetchAnnouncement}
          navigation={navigation}
        />
      ))}
      <NewMessage
        title={'New Announcement'}
        visible={isPopupVisible}
        onClose={closePopup}
        onSubmit={onSubmit}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    borderRadius: 25,
    zIndex: 10,
    marginTop: 25,
  },
  addIcon: {
    width: 20,
    height: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startContainer: {
    width: 50, // Ensure the touch target is large enough
  },
  iconStyle: {
    color: '#007bff',
    size: 30,
  },
  addIcon: {
    width: 20,
    height: 20,
  },
});

export default AnnouncementMessages;
