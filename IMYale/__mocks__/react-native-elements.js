// __mocks__/react-native-elements.js
import React from 'react';

const Button = ({ title, onPress, buttonStyle, titleStyle, testID }) => {
  // Customize the mock behavior as needed
  return (
    <button onClick={onPress} style={buttonStyle} testID={testID}>
      <span style={titleStyle}>{title}</span>
    </button>
  );
};

export {Button};
