import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


/**
 * A reusable Red Button component for triggering actions.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.title - The text displayed on the button.
 * @param {function} props.onPress - The function to be executed when the button is pressed.
 * @returns {JSX.Element} JSX element representing the Red Button.
 */
const RedButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default RedButton;
