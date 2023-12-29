# IMYale

## Project Overview

IMYale is a comprehensive app designed to enhance the experience of intramural sports at Yale University. It serves as a one-stop platform for viewing, participating in, and managing intramural sports. The app is tailored to meet the needs of both players and administrators, ensuring a seamless and engaging sports management experience.

## Features

### User Features

1. **Viewing Games and Game Details**: Users can view a list of upcoming games and sign up for them. The app allows filtering by sport and residential college. Detailed information about each game, including date, time, sport, and participants, is readily accessible.
2. **Signing up for Games**: Users can easily sign up for games, with sign-ups restricted to games within their residential college.
3. **Viewing Leaderboard**: The leaderboard displays colleges’ win/loss ratios, number of wins, losses, and overall ranking, with the option to filter by sport.
4. **Viewing Calendar**: A calendar view shows the schedule of games the user has signed up for, with options to navigate to specific game details.
5. **Viewing and Replying to Announcements**: Users can view and respond to announcements related to their games, sent out by college admins.
6. **CAS Login**: Access to the app is exclusive to Yale students, secured through Yale CAS authentication.
7. **Viewing Game History**: Users can view concluded games, including those with results entered by admins. This feature also allows filtering by sport and provides access to the scores of each game.

### Admin Features

In addition to all user features, admins have extra capabilities:

1. **Adding Games**: Admins can add new games by specifying details such as residential college teams, date, time, and sport.
2. **Editing Games**: Existing game details can be altered as needed.
3. **Entering Results for a Game**: Post-game, admins can input the results to update the game history and leaderboard standings.
4. **Sending Announcements**: Admins can send targeted announcements for each game to their respective teams.

## View Deployment

The iOS frontend has been deployed for Beta testing on TestFlight. It is connected to our backend that is deployed on Heroku. Download the iOS app from TestFlight with this [link](https://testflight.apple.com/join/0UhxthzQ), or scan the QR code below.


Note: login with your Yale NetID. Some features are exclusive to students in residential colleges and to the admins, view our [demo video](#view-demo) for complete walkthrough of the app. (After login, if you see a -1004 error loading page, exit the app from backend and reopen it to proceed. This happens sometimes).

<img src="https://github.com/yale-swe/f23-imyale/blob/metrics_milestone/IMYaleTestFlightQR.png" alt="IMYale QR" width="200">

## Installation (to run locally)

`f23-imyale` consists of both frontend and backend components. The `IMYale` folder contains the frontend, while the `IMYaleBackend` folder contains the backend. Before beginning the installation, ensure you have XCode and an iPhone simulator installed.

1. **Prepare Directory and Clone Repo**: Navigate to a desired folder directory in your command line. Ensure that this directory has no spaces in its path. Clone this repository with this command
   `git clone https://github.com/yale-swe/f23-imyale.git`

2. **Install Backend Dependencies**: Execute `cd IMYaleBackend && npm i` to install backend dependencies.
3. **Run the Backend**: Use `npm start` to run the backend server.
4. **Install Frontend Pods and Dependencies**: Navigate back to the root directory with `cd ..` and then run the following commands `&& cd IMYale && npx pod-install && npm i` to install frontend pods and dependencies.
5. **Run the Frontend**: Start the frontend application with `npm start`.
6. **React Native CLI**: For more information on setting up the development environment for React Native CLI, see [documentation](https://reactnative.dev/docs/environment-setup?os=macos&platform=ios).

## Production Deployment

We utilize Docker to ensure that our application is easily deployable. To deploy our application, simply run `docker compose up` in the root directory. This will create at least two containers: an Nginx container, which serves as a reverse proxy, and a Node.js container, which serves as the backend. The app can then be accessed on port 80.

Ensure that you have Docker Engine installed before running this step. If you do not have Docker installed, you can follow the instructions [here](https://docs.docker.com/engine/install/) to install it.

## Metrics Milestone

In this project, we implemented the Multi-Armed Bandit procedure for our MatchBlock Component (the block that users click to view game details and sign up for a game). We test effects of ... <list out changed styles>.

Codewise, the backend logic for this is implemented in the matchClickController.js file in the controllers folder of the IMYaleBackend Directory. For the frontend, the code to retrieve the desired version of the matchblock component for testing is in the HomeScreen.js file of the navigation/screens/Games directory of the IMYale directory.

## Tests

Instructions on tests for [frontend](https://github.com/yale-swe/f23-imyale/tree/main/IMYale#readme) and [backend](https://github.com/yale-swe/f23-imyale/tree/main/IMYaleBackend#readme) are in the readme files in corresponding folders, and can be accessed with the links.

## View Demo

To view a working demo of the app, navigate to the root directory and watch the IMYale App Video [Demo.mov](https://github.com/yale-swe/f23-imyale/blob/metrics_milestone/IMYale%20App%20Video%20Demo.mov) file.
