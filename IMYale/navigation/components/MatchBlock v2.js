import React, {useState} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {apiURL, approvedRole} from '../../global.js';
import axios from 'axios';
/**
 * A component representing a match block for displaying game information on the home screen
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props._id - The unique identifier for the game.
 * @param {string} props.team1 - The name of team 1.
 * @param {string} props.team2 - The name of team 2.
 * @param {number} props.scoreHome - The score of team 1.
 * @param {number} props.scoreAway - The score of team 2.
 * @param {string} props.winner - The name of the winning team.
 * @param {Array} props.team1Users - An array of users for team 1.
 * @param {Array} props.team2Users - An array of users for team 2.
 * @param {string} props.sport - The name of the sport.
 * @param {string} props.date - The date of the match.
 * @param {boolean} props.completed - Indicates if the match is completed.
 * @param {boolean} props.isPlayOff - Indicates if the match is a playoff match.
 * @returns {JSX.Element} JSX element representing the MatchBlock component.
 */
const MatchBlock = ({
  role,
  _id: gameID,
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
}) => {
  const isNoWinner = winner != team1 && winner != team2;

  const isTeam1Winner = winner === team1;

  //Format the date and time. Used in several screens and components
  function formatDateAndTime() {
    const day = new Date(date).getDate().toString().padStart(2, '0');
    const month = (new Date(date).getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = new Date(date).getFullYear();

    const dateString = `${month}/${day}/${year}`;

    let hours = new Date(date).getHours();
    const minutes = new Date(date).getMinutes().toString().padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // If hours is 0, set to 12 (for 12 AM)

    const timeString = `${hours}:${minutes} ${ampm}`;
    return {dateString, timeString};
  }
  //convert the date in to date and time strings to be displayed
  const {dateString, timeString} = formatDateAndTime(new Date(date));

  let sportString = sport;
  let timeStr = timeString;
  let dateStr = dateString;
  let resCo1 = team1;
  let resCo2 = team2;

  //get images for the colleges
  const resImages = {
    BF: require('../../assets/colleges/BF.png'),
    BK: require('../../assets/colleges/BK.png'),
    BR: require('../../assets/colleges/BR.png'),
    DP: require('../../assets/colleges/DP.png'),
    ES: require('../../assets/colleges/ES.png'),
    GH: require('../../assets/colleges/GH.png'),
    JE: require('../../assets/colleges/JE.png'),
    MO: require('../../assets/colleges/MO.png'),
    MY: require('../../assets/colleges/MY.png'),
    PM: require('../../assets/colleges/PM.png'),
    PS: require('../../assets/colleges/PS.png'),
    SM: require('../../assets/colleges/SM.png'),
    SY: require('../../assets/colleges/SY.png'),
    TD: require('../../assets/colleges/TD.png'),
    TR: require('../../assets/colleges/TR.png'),
  };
  //get images for the sports
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

  //set these images to the correct colleges and sports
  let sportImage = sportImages[sport];
  let iconLeft = resImages[team1];
  let iconRight = resImages[team2];
  let leftNum = scoreHome;
  let rightNum = scoreAway;

  /**
   * React Navigation hook for navigation.
   */
  const navigation = useNavigation();

  /**
   * Handle redirection to announcement messages screen.
   */
  const handleRedirection = async () => {
    try {
      await axios.post(`${apiURL}/api/games/matchblockclicks`, {
        variationID: 2,
      });
      // Handle successful click logging
    } catch (error) {
      // Handle error
      console.error('Error logging click:', error);
    }
    //creating a dictionary with game data and passing relevant information to the game summary page.
    console.log('Game ID: ' + gameID);
    const gameDetails = {
      gameID: gameID,
      role: role,
      team1: team1,
      team2: team2,
      scoreHome: scoreHome,
      scoreAway: scoreAway,
      winner: winner,
      team1Users: team1Users, // You would need to gather the users for team 1
      team2Users: team2Users, // You would need to gather the users for team 2
      sport: sport,
      date: date, // Create a real date object here
      completed: completed,
    };
    console.log(gameDetails);
    navigation.replace('GameSummary', gameDetails);
  };
  return (
    <TouchableOpacity onPress={handleRedirection}>
      <View
        style={[styles.blockContainer, isPlayOff && styles.playOffContainer]}>
        {isPlayOff && (
          <View style={styles.playOffLabel}>
            <Text style={styles.playOffText}>PLAYOFF</Text>
          </View>
        )}
        <View style={styles.iconBlockContainerLeft}>
          <Image
            source={iconLeft}
            style={styles.iconLeft}
            resizeMode="contain"
          />
          <Text style={styles.nameText}>{resCo1}</Text>
          <View
            style={
              isNoWinner
                ? styles.numWrapperTied
                : isTeam1Winner
                ? styles.numWrapperLost
                : styles.numWrapper
            }>
            <Text style={styles.numText}>{leftNum}</Text>
          </View>
        </View>

        <View style={styles.iconBlockContainerRight}>
          <Image
            source={iconRight}
            style={styles.iconRight}
            resizeMode="contain"
          />
          <Text style={styles.nameText}>{resCo2}</Text>
          <View
            style={
              isNoWinner
                ? styles.numWrapperTied
                : isTeam1Winner
                ? styles.numWrapper
                : styles.numWrapperLost
            }>
            <Text style={styles.numText}>{rightNum}</Text>
          </View>
        </View>

        <Image
          source={sportImage}
          style={styles.sportIcon}
          resizeMode="contain"
        />

        <Text style={styles.timeText}>{timeStr}</Text>
        <Text style={styles.dateText}>{dateStr}</Text>
        <Text style={styles.sportText}>{sportString}</Text>
        <Text style={styles.vsText}>{'VS'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  blockContainer: {
    flexDirection: 'row',
    margin: 10,
    marginHorizontal: 20,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    padding: 0,
    height: 130,
    position: 'relative',
    // ...(Platform.OS === 'android'
    // ? { elevation: 5 } // Add elevation (shadow) for Android
    // : Platform.OS === 'ios'
    // ? {
    //     shadowColor: 'black',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.4,
    //     shadowRadius: 4,
    //   }
    // : {}),
  },
  iconBlockContainerLeft: {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    top: '46%',
    left: '20%',
    transform: [{translateX: -40}, {translateY: -40}],
    width: 80,
    height: 120,
  },
  iconLeft: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  iconBlockContainerRight: {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    top: '46%',
    left: '80%',
    transform: [{translateX: -40}, {translateY: -40}],
    width: 80,
    height: 120,
  },

  iconRight: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  sportIcon: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: [{translateX: -10}, {translateY: -10}],
    width: 20,
    height: 20,
  },
  dateText: {
    textAlign: 'center',
    color: 'red',
    position: 'absolute',
    left: 0,
    right: 0,
    top: '73%',
    fontSize: 10,
  },
  timeText: {
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: '84%',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sportText: {
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: '30%',
    fontSize: 10,
  },
  vsText: {
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    fontSize: 10,
    fontWeight: 'bold',
  },

  nameText: {
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: '68%',
    fontSize: 14,
  },
  numWrapper: {
    position: 'absolute',
    alignItems: 'center',
    width: 30,
    height: 16,
    left: 25,
    top: '86%',
    borderRadius: 5,
    padding: 2,
    backgroundColor: 'darkgreen',
  },
  numWrapperLost: {
    position: 'absolute',
    alignItems: 'center',
    width: 30,
    height: 16,
    left: 25,
    top: '86%',
    borderRadius: 5,
    padding: 2,
    backgroundColor: 'darkred',
  },
  numWrapperTied: {
    position: 'absolute',
    alignItems: 'center',
    width: 30,
    height: 16,
    left: 25,
    top: '86%',
    borderRadius: 5,
    padding: 2,
    backgroundColor: 'grey',
  },
  numText: {
    textAlign: 'center',
    position: 'absolute',
    fontSize: 12,
    color: 'white',
  },
  playOffContainer: {
    borderColor: 'gold', // Border color for playoffs
    borderWidth: 2, // Border width for playoffs
  },
  playOffLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'gold',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  playOffText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 10,
  },
};

export default MatchBlock;
