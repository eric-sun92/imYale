import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import axios from 'axios';
import MessageBlock from 'IMYale/navigation/components/MessagesBlock.js';
import NewMessage from '../../components/newMessage';
import ReplyBlock from '../../components/ReplyBlock';
import {apiURL} from '../../../global';

/**
 * Component for displaying a full message and its replies.
 * Allows users to add new replies and navigate back to the announcement screen.
 *
 * @param {object} route - The route object containing parameters passed to this screen.
 * @param {object} navigation - Navigation object for screen transitions.
 * @returns {JSX.Element} - The rendered component for the full message view.
 */
const FullMessage = ({route, navigation}) => {
  const {userID, message, senderName} = route.params;
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  //   console.log(userID);

  /**
   * Fetches replies for the current message.
   */
  const fetchReplies = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/api/message/replies/${message._id}`,
      );
      let replies = response.data;

      // Sort replies by decreasing order of timestamp
      replies.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setReplies(replies);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching replies:', error);
      setLoading(false);
    }
  };

  // Fetch replies for the message when component mounts or message changes
  useEffect(() => {
    // Fetch replies for the message
    fetchReplies();
  }, [message._id]);

  /**
   * Toggles the visibility of the reply input popup.
   */
  const handleAddReply = () => {
    // navigation.replace("Main")
    setPopupVisible(true);
  };

  /**
   * Closes the reply input popup.
   */
  const closePopup = () => {
    setPopupVisible(false);
  };
  /**
   * Navigates back to the announcement screen.
   */
  const backtoAnnouncement = () => {
    navigation.goBack();
  };

  /**
   * Handles the submission of a new reply.
   * @param {string} text - The text of the reply to be submitted.
   */
  const onSubmit = async text => {
    // Function to create a new message in the database
    const createMessage = () => {
      const messageData = {
        text: inputValue,
      };
      // Send a POST request to create a new message and return the promise
      return axios.post(`${apiURL}/api/message/addMessage`, messageData);
    };
    // Function to link the newly created reply to the current message
    const addReplyToMessage = (messageId, replyId) => {
      const data = {
        messageId: messageId, // ID of the current message
        replyId: replyId, // ID of the newly created reply
      };
      // Send a PUT request to add the reply to the message and return the promise
      return axios.put(`${apiURL}/api/message/replies/addReply`, data);
    };

    // Create a new message (reply)
    createMessage()
      .then(response => {
        // Extract the ID of the newly created reply
        const replyId = response.data.id;

        // Add the new reply to the current message
        return addReplyToMessage(message._id, replyId);
      })
      .then(response => {
        // After successfully adding the reply, fetch the updated list of replies
        fetchReplies();
      })
      .catch(error => {
        // Log any errors that occur during the process
        console.error(error);
      });
    setPopupVisible(false);
  };

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.startContainer}>
        <TouchableOpacity onPress={backtoAnnouncement}>
          <Image
            source={require('../../../assets/utils/back.png')}
            style={{width: 20, height: 20}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.startContainer2}>
        <TouchableOpacity onPress={handleAddReply}>
          <Image
            source={require('../../../assets/icons/reply.png')}
            style={styles.reply}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Announcement - {senderName}</Text>
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>{message.text}</Text>
      </View>
      <TouchableOpacity
        style={styles.replyButton}
        onPress={handleAddReply}
        activeOpacity={0.7} // Dim the button slightly on press
      >
        {/* <Text style={styles.replyButtonText}>Reply</Text> */}
      </TouchableOpacity>
      {/* <Button title="Reply" onPress={handleAddReply} /> */}

      {replies.map(reply => (
        <ReplyBlock
          userID={userID}
          key={reply._id}
          message={reply}
          fetchReplies={fetchReplies}
        />
      ))}
      <NewMessage
        title={'New Reply'}
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
    backgroundColor: '#fff', // Consider a light, neutral background color
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
    marginTop: -15,
  },
  messageBox: {
    padding: 15,
    backgroundColor: '#f9f9h9',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageText: {
    marginTop: -10,
    fontSize: 12,
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  startContainer2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reply: {
    width: 25,
    height: 25,
    marginRight: 25,
  },
  // Add any additional styles you need
});

export default FullMessage;
