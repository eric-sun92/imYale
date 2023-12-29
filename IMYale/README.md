# Frontend Documentation

## Overview:

The IMYale Frontend is an integral part of the IMYale application, specifically designed to provide a seamless and engaging user interface for Yale University's intramural sports community. This frontend application serves as the user's gateway to viewing, signing up for, and interacting with various aspects of intramural sports activities.

Built with a focus on user experience, the frontend is structured to offer intuitive navigation and easy access to key features such as viewing upcoming games, signing up for events, checking leaderboards, and interacting with game announcements. The design caters to both general users and administrators, ensuring a comprehensive and tailored experience for each user role.

## Tech Stack

The frontend is built entirely using React and React Native. With React, we leverage its hooks and state management for dynamic UI updates. With React Native we leverate mobile-specific visual components.

## IMYale Frontend File Structure

This section outlines the main directories and files within the IMYale frontend repository.

## Directory Structure

### Root Directory

- `App.tsx`: The root component that holds the overall structure of the application.
- `index.js`: Entry point for the application which renders the App component. Includes the navigation stack for all screens in the app.
- `global.js`: Contains global variables for the application.
- `README.md`: Documentation for the frontend codebase.
- `.eslintrc.js`, `.prettierrc.js`, `babel.config.js`, `jest.config.js`, `metro.config.js`, `tailwind.config.js`, `tsconfig.json`: Configuration files for ESLint, Prettier, Babel, Jest, Metro Bundler, Tailwind CSS, and TypeScript respectively.

### navigation Directory

- `components/`: Reusable components specific to navigation.
  - `AnnouncementsBlock.js`: Component for displaying announcements to navigate to.
  - `Button.js`: Generic button component for navigation.
  - `MatchBlock.js`: Component for displaying match blocks (information about each game).
  - `MessagesBlock.js`: Component for displaying messages blocks with announcement messages on them.
  - `newMessage.js`: Component for creating new messages.
  - `ReplyBlock.js`: Component for displaying reply blocks with announcement replies on them.
- `screens/`: Screens used in navigation.
  - `Announcements/`: Screens related to announcements.
    - `AnnouncementMessages.js`: Screen for displaying messages within announcements.
    - `AnnouncementsPage.js`: Main screen for displaying announcements.
  - `Games/`: Screens related to game management.
    - `AddGame.js`: Screen for adding a new game.
    - `EditGame.js`: Screen for editing game details.
    - `EnterResults.js`: Screen for entering game results.
    - `GameHistory.js`: Screen for viewing past games.
    - `GameSummary.js`: Screen for viewing a summary of a game.
    - `HomeScreen.js`: The home screen of the application, where users can view all upcoming games.
  - `Leaderboard/`: Screens related to the leaderboard.
    - `Leaderboard.js`: Screen for displaying the leaderboard.
  - `Login/`: Screens related to user login.
    - `LoginScreen.js`: Screen for navigating to CAS login
  - `Profile/`: Screens related to user profiles.
    - `ProfileScreen.js`: Screen for displaying user profiles.

### Other Directories

- `assets/`: Static assets like images and icons. Includes Residential College logos and sports icons
- `ios/`, `android/`: Platform-specific code for iOS and Android.
- `__tests__/`: Test files for the application components and features.
- `_mocks__/`: Mock files used in testing.

## Other Important Files

- `package.json`: Lists all the dependencies and scripts for the project.
- `package-lock.json`: Lock file automatically generated for any operations where npm modifies either the `node_modules` tree or `package.json`.

Sure, here's the revised section with the requested additions:

---

## Communication with Backend

The frontend interacts with the backend through a series of RESTful API calls. We use Axios, a promise-based HTTP client, to handle these requests efficiently and seamlessly. The API requests are designed to communicate with our Node.js backend, which in turn interacts with the MongoDB database to fetch or store information as needed.

For detailed information on the specific API endpoints, including their expected inputs and outputs, please refer to the README file located in the `IMYaleBackend` directory. This will provide you with a comprehensive guide to the API's structure and the functionality exposed by each endpoint.

Sure, I can help rewrite the testing instructions to make them more comprehensive and descriptive. Here's a revised version of the testing instructions for the frontend:

---

## Frontend Testing Instructions

### Setting Up for Testing

Our frontend tests are powered by Jest and the React Testing Library. These tools provide a robust environment for writing and executing tests on our React components.

#### Dependencies Installation

The steps for installing the project dependencies typically include everything you need for testing. However, if Jest and React Testing Library are not installed, you can install them along with other necessary packages by running:

```bash
npm install --save-dev jest @testing-library/react-native react-test-renderer @testing-library/jest-native
```

### Understanding the Test Environment

Our frontend tests are organized into two primary directories:

- `./__mocks__`: This directory contains mocks for dependencies that aren't natively supported by Jest. For instance, if you need to mock a third-party library or native module, you would place your mock implementation here.

- `./__tests__`: This is where the actual test files reside. Each test file typically corresponds to a specific component or functionality in the application.

### Configuring Jest

To ensure Jest is properly configured for our React Native environment, create a `jest.config.js` file in the root directory of your project with the following content:

```javascript
module.exports = {
  preset: 'react-native',
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-calendars|react-native-webview|@react-native-community/datetimepicker)/)',
  ],
};
```

### Updating `package.json` for Test Scripts

In your `package.json`, include the following scripts to facilitate running tests:

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

- `"test"`: Runs the entire test suite once.
- `"test:watch"`: Runs Jest in watch mode, which is useful during development as it re-runs tests related to changed files.
- `"test:coverage"`: Generates a test coverage report.

### Writing Your Own Tests

To create a new test:

1. **Create a New Test File**: Add a file in the `./__tests__` directory. The file name should ideally reflect the component or function it's testing. For instance, `MyComponent.test.js` for testing `MyComponent.js`.

2. **Structure Your Test File**: Use `describe` blocks to group related tests and `it` or `test` for individual test cases. Here's a basic structure:
   Certainly! Here's a detailed explanation of the example test case you've provided, which can be included in the README file under the section for writing frontend tests using React Testing Library and Jest.

---

## Frontend Testing Instructions with React Testing Library and Jest

### Example Test Case Explanation

To provide a clear understanding of how to write frontend tests, here’s a breakdown of an example test case for a React component:

```javascript
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import MyComponent from '../path/to/MyComponent';

describe('MyComponent Tests', () => {
  it('renders correctly', () => {
    const {getByText} = render(<MyComponent />);
    expect(getByText('Expected Text')).toBeTruthy();
  });

  // Add more tests as needed
});
```

In this test:

- **Import Statements**: We begin by importing necessary modules and components. `React` is needed for rendering JSX. `render` and `fireEvent` are imported from `@testing-library/react-native` for rendering components and simulating user actions.

- **Component Import**: The component to be tested, `MyComponent`, is imported from its file location.

- **Describe Block**: The `describe` function is used to group together similar tests. Here, it groups tests for `MyComponent`.

- **Test Case**: Inside the `describe` block, we use the `it` function to define individual test cases. Each `it` block represents a specific aspect of the component that we want to test.

- **Rendering the Component**: The `render` function is used to render the component into a virtual DOM for testing.

- **Assertions**:
  - `getByText` is a query function from React Testing Library that returns the first matching node for the provided text.
  - `expect` is used to make an assertion about the output. In this case, we're asserting that the text "Expected Text" is present in the rendered component, indicating the component is rendering correctly.

### Writing Your Tests

- **Test Files**: Create test files in a directory specific to your tests, typically named `__tests__`.
- **Running Tests**: Execute your tests with `npm test` or `npm run test:watch` for development.
- **Additional Tests**: Add more test cases under the same `describe` block to cover different aspects of your component's behavior, like handling user interactions, state changes, and props variations.

-------------------------------------------|---------|----------|---------|---------|-----------------------------------------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s  
-------------------------------------------|---------|----------|---------|---------|-----------------------------------------------------
All files | 70.69 | 55.78 | 50.42 | 71.09 |  
 IMYale | 100 | 100 | 100 | 100 |  
 global.js | 100 | 100 | 100 | 100 |  
 IMYale/assets/colleges | 100 | 100 | 100 | 100 |  
 BF.png | 100 | 100 | 100 | 100 |  
 BK.png | 100 | 100 | 100 | 100 |  
 BR.png | 100 | 100 | 100 | 100 |  
 DP.png | 100 | 100 | 100 | 100 |  
 ES.png | 100 | 100 | 100 | 100 |  
 GH.png | 100 | 100 | 100 | 100 |  
 JE.png | 100 | 100 | 100 | 100 |  
 MO.png | 100 | 100 | 100 | 100 |  
 MY.png | 100 | 100 | 100 | 100 |  
 PM.png | 100 | 100 | 100 | 100 |  
 PS.png | 100 | 100 | 100 | 100 |  
 SM.png | 100 | 100 | 100 | 100 |  
 SY.png | 100 | 100 | 100 | 100 |  
 TD.png | 100 | 100 | 100 | 100 |  
 TR.png | 100 | 100 | 100 | 100 |  
 IMYale/assets/icons | 100 | 100 | 100 | 100 |  
 history.png | 100 | 100 | 100 | 100 |  
 IMYale/assets/sports | 100 | 100 | 100 | 100 |  
 badminton.png | 100 | 100 | 100 | 100 |  
 basketball.png | 100 | 100 | 100 | 100 |  
 cornhole.png | 100 | 100 | 100 | 100 |  
 dodgeball.png | 100 | 100 | 100 | 100 |  
 football.png | 100 | 100 | 100 | 100 |  
 ice-hockey.png | 100 | 100 | 100 | 100 |  
 pickleball.png | 100 | 100 | 100 | 100 |  
 ping-pong.png | 100 | 100 | 100 | 100 |  
 soccer.png | 100 | 100 | 100 | 100 |  
 volleyball.png | 100 | 100 | 100 | 100 |  
 water-polo.png | 100 | 100 | 100 | 100 |  
 IMYale/assets/utils | 100 | 100 | 100 | 100 |  
 back.png | 100 | 100 | 100 | 100 |  
 checked.png | 100 | 100 | 100 | 100 |  
 editPencil.png | 100 | 100 | 100 | 100 |  
 logout.png | 100 | 100 | 100 | 100 |  
 plus.png | 100 | 100 | 100 | 100 |  
 x.png | 100 | 100 | 100 | 100 |  
 IMYale/navigation/components | 88.29 | 54.16 | 78.57 | 88.29 |  
 AnnouncementsBlock.js | 91.66 | 50 | 66.66 | 91.66 | 77-78  
 Button.js | 100 | 100 | 100 | 100 |  
 MatchBlock.js | 88.57 | 50 | 66.66 | 88.57 | 108-123  
 MessagesBlock.js | 82.75 | 100 | 83.33 | 82.75 | 35-36,61-62,68  
 newMessage.js | 100 | 100 | 100 | 100 |  
 IMYale/navigation/screens/Games | 52.95 | 20 | 25.74 | 53.96 |  
 AddGame.js | 45.8 | 32 | 17.14 | 41.9 |  
 EditGame.js | 51.72 | 100 | 18.18 | 51.72 | 48-72,80-85,111-198  
 EnterResults.js | 41.66 | 0 | 14.28 | 41.66 | 54-85,94-98,122-128  
 GameHistory.js | 77.77 | 100 | 53.84 | 77.77 | 38,52,63,69,94-111  
 GameSummary.js | 53.48 | 22.22 | 17.24 | 55.64 | ...-128,164-177,182-195,199,212-299,306-314,325-383
HomeScreen.js | 62 | 23.07 | 39.13 | 63.26 | 62,73,83,96-98,110-119,128,137,143,158  
 IMYale/navigation/screens/Leaderboard | 76.92 | 80.43 | 71.42 | 76.92 |  
 Leaderboard.js | 76.92 | 80.43 | 71.42 | 76.92 | 52,63,96-107,133,144  
 IMYale/navigation/screens/Login | 56.41 | 41.66 | 70 | 56.41 |  
 LoginScreen.js | 56.41 | 41.66 | 70 | 56.41 | 42,47-50,69-77,131-140  
 IMYale/navigation/screens/Profile | 79.59 | 50 | 57.14 | 79.16 |  
 ProfileScreen.js | 79.59 | 50 | 57.14 | 79.16 | 88,96,110-112,120,133-136,177  
 IMYale/navigation/screens/z_Extra Screens | 93.33 | 100 | 83.33 | 93.02 |  
 DMScreen.js | 76.92 | 100 | 62.5 | 75 | 7,23-25  
 LoginInputScreen.js | 100 | 100 | 100 | 100 |  
 MessageScreen.js | 100 | 100 | 100 | 100 |  
 SignupScreen.js | 100 | 100 | 100 | 100 |

---
