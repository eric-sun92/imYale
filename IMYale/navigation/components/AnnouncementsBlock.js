import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

/**
 * React Native component for displaying an announcement block. This block displays game information relevant to announcements
 * and provides a link to the announcement messages.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props._id - The unique identifier for the game.
 * @param {string} props.team1 - The abbreviation of the first team.
 * @param {string} props.team2 - The abbreviation of the second team.
 * @param {string} props.sport - The sport for the game.
 * @param {Date} props.date - The date and time of the announcement.
 * @param {Object[]} props.announcement - An array of announcement objects.
 * @returns {JSX.Element} JSX element representing the announcement block.
 */

const AnnouncementBlock = ({
  _id: gameID,
  team1,
  team2,
  sport,
  date,
  announcement,
}) => {
  /**
   * Format the date and time.
   *
   * @function
   * @returns {string} Formatted date and time string.
   */
  const formatDateAndTime = () => {
    const day = new Date(date).getDate().toString().padStart(2, '0');
    const month = (new Date(date).getMonth() + 1).toString().padStart(2, '0');
    const year = new Date(date).getFullYear();

    // console.log(month);

    let hours = new Date(date).getHours();
    const minutes = new Date(date).getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    monthName = monthNames[month - 1];

    return `${monthName} ${day} @${hours}:${minutes} ${ampm}`;
  };

  /**
   * React Navigation hook for navigation.
   */
  const navigation = useNavigation();

  const colleges = {
    BR: 'Branford',
    TR: 'Trumbull',
    PS: 'Pierson',
    DP: 'Davenport',
    PM: 'Pauli Murray',
    BF: 'Ben Franklin',
    MO: 'Morse',
    TD: 'Timothy Dwight',
    JE: 'Jonathan Edwards',
    EZ: 'Ezra Stiles',
    BK: 'Berkeley',
    GH: 'Grace Hopper',
    SY: 'Saybrook',
    SM: 'Silliman',
  };

  // Get the full name of the teams from the abbreviated name of the colleges in the database.
  team1Name = colleges[team1];
  team2Name = colleges[team2];

  /**
   * Handle redirection to announcement messages screen.
   */
  const handleRedirection = () => {
    const gameDetails = {announcement};
    navigation.navigate('AnnouncementMessages', gameDetails);
  };

  sport_name = String(sport);
  // Get the image URL for the sport.
  const sportImages = {
    badminton: require('../../assets/sports/badminton.png'),
    basketball: require('../../assets/sports/basketball.png'),
    cornhole: require('../../assets/sports/cornhole.png'),
    dodgeball: require('../../assets/sports/dodgeball.png'),
    football: require('../../assets/sports/football.png'),
    broomball: require('../../assets/sports/ice-hockey.png'),
    pickleball: require('../../assets/sports/pickleball.png'),
    pingPong: require('../../assets/sports/ping-pong.png'),
    soccer: require('../../assets/sports/soccer.png'),
    volleyball: require('../../assets/sports/volleyball.png'),
    waterPolo: require('../../assets/sports/water-polo.png'),
  };

  return (
    <TouchableOpacity onPress={handleRedirection} style={styles.blockContainer}>
      <Image source={sportImages[sport]} style={styles.sportIcon} />
      <View style={styles.detailsContainer}>
        <Text style={styles.dateTimeText}>{formatDateAndTime()}</Text>
        <Text
          style={styles.gameDetailsText}>{`${team1Name} vs ${team2Name}`}</Text>
        <Text style={styles.sportText}>
          {sport.substring(0, 1).toUpperCase() + sport.substring(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  blockContainer: {
    flexDirection: 'row', // Align items in a row
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center', // Align items vertically
    shadowColor: '#000', // Shadow for the card
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  sportIcon: {
    width: 50, // Adjust the size as needed
    height: 50, // Adjust the size as needed
    marginRight: 12, // Add some spacing between the icon and the text
  },
  detailsContainer: {
    flex: 1,
    alignItems: 'flex-start', // Align text to the start of the container
  },
  dateTimeText: {
    fontSize: 14, // Adjust to match the image
    fontWeight: 'bold',
    color: '#6B4EFF', // Replace with the color from the image
  },
  gameDetailsText: {
    fontSize: 18, // Adjust to match the image
    fontWeight: 'bold',
    color: '#yourColor', // Replace with the color from the image
    marginBottom: 5,
  },
  sportText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#72777A', // Replace with the color from the image
    fontWeight: 'bold',
  },
};

export default AnnouncementBlock;
