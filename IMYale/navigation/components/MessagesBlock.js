import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';
import {apiURL} from '../../global';
// import {navigation} from '@react-navigation/native';

/**
 * A component representing a message block for displaying user messages.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.message - The message object to be displayed.
 * @param {Function} props.fetchAnnouncement - A function to fetch announcements (used for deleting messages).
 * @param {Object} props.navigation - React Navigation object for navigation actions.
 * @returns {JSX.Element} JSX element representing the MessageBlock component.
 */
const MessageBlock = ({userID, message, fetchAnnouncement, navigation}) => {
  // State to store the sender's name
  const [senderName, setSenderName] = useState('');
  const [senderID, setSenderID] = useState('');

  //   let isAdmin = true;

  // useEffect hook to fetch the sender's profile when the component mounts or when the message prop changes
  useEffect(() => {
    const fetchSenderProfile = async () => {
      try {
        console.log(message);
        // Fetch the sender's profile using the sender's ID from the message
        const response = await axios.get(
          `${apiURL}/api/profileid/${message.sender._id}`,
        );
        const senderProfile = response.data.profile;
        // Set the sender's name by combining their first and last names
        setSenderName(`${senderProfile.first_name} ${senderProfile.last_name}`);
        setSenderID(senderProfile.netid);
      } catch (error) {
        // Handle any errors by logging them and setting a default "Unknown Sender" name
        console.error('Error fetchng prle:', error);
        setSenderName('Unknown Sender');
      }
    };
    // Call the fetchSenderProfile function when the component mounts or when the message prop changes
    fetchSenderProfile();
  }, [message]);

  // Function to format a date string to a human-readable format
  const formatDate = dateString => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${formattedDate} at ${formattedTime}`;
  };

  // Function to handle deleting a message
  const handleDelete = async () => {
    console.log('Delete message:', message._id);
    try {
      // Send a request to delete the message with the given ID
      const response = await axios.delete(
        `${apiURL}/api/message/${message._id}`,
      );
      fetchAnnouncement();
    } catch (error) {
      // Handle any errors by logging them and setting a default "Unknown Sender" name
      console.error('Error fetching profile:', error);
      setSenderName('Unknown Sender');
    }
  };
  // Function to handle redirection to a full message page
  const handleRedirection = () => {
    // Navigate to the "FullMessage" screen and pass along the message and senderName as route parameters
    navigation.navigate('FullMessage', {
      userID: userID,
      message: message,
      senderName: senderName,
    });
  };
  return (
    <TouchableOpacity onPress={handleRedirection}>
      <View style={styles.messageContainer}>
        <Text style={styles.senderName}>{senderName}</Text>
        <Text style={styles.messageText}>{message.text}</Text>
        <Text style={styles.dateLabel}>
          Date:{' '}
          <Text style={styles.dateText}>{formatDate(message.timestamp)}</Text>
        </Text>
        {userID == userID && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity onPress={handleReply} style={styles.replyButton}>
                    <Text style={styles.replyButtonText}>Reply</Text>
            </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2a2a2a',
    marginBottom: 6,
  },
  messageText: {
    fontSize: 15,
    color: '#4a4a4a',
    marginBottom: 5,
  },
  dateLabel: {
    fontSize: 13,
    color: '#666',
  },
  dateText: {
    fontSize: 13,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#ff6347', // Tomato color for delete button
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-end', // Align button to the right
    marginTop: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  replyButton: {
    backgroundColor: '#4caf50', // Green color for reply button
    padding: 8,
    borderRadius: 6,
    marginLeft: 5, // Add some space if there's a delete button
  },
  replyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MessageBlock;
