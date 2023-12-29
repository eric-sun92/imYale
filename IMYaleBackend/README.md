## IMYaleBackend Overview

The IMYaleBackend provides the server-side logic for the IMYale platform, encompassing API endpoints, data manipulation, and user authentication. It supports the CAS authentication protocol for secure login procedures, handles the creation and editing of game content, manages announcements, and maintains comprehensive user profiles. Leveraging Mongoose models, it ensures structured and efficient interactions with the MongoDB database. The backend's controllers are integral, orchestrating the flow of data and implementing the platform's core functionalities.

## Technologies Used

- **Node.js**: Our backend is built on Node.js, a JavaScript runtime known for its efficiency and scalability. It powers our server and allows us to build fast, scalable network applications.

- **MongoDB**: We use MongoDB as our primary database. It's a NoSQL database, which offers flexibility and scalability, making it ideal for handling our diverse data requirements.

- **Passport.js**: For authentication, we utilize Passport.js, a middleware for Node.js that simplifies the process of handling authentication. It is used in conjunction with CAS (Central Authentication Service) to provide a secure and streamlined login process.

These technologies collectively provide a robust foundation for our backend, ensuring fast processing, secure data handling, and reliable user authentication.

## IMYaleBackend File Structure
- **api/**

  - **controllers/**: Contains the logic for handling requests to various API endpoints.
    - **announcements/**: Manages announcement-related actions.
    - **authentication/**: Handles authentication processes including CAS login.
    - **chat/**: Deals with chat system operations.
    - **errors/**: Centralizes error handling routines.
      - **errors.js**: defines various errors, and sets up error handling
    - **gamesController.js/**: defines and handles actions for creating, retrieving, and removing game information.
    - **profileController.js/**: defines and handles actions for creating and retrieving user profile information
    - **rolesManagementController/**: Handles role and permission assignments.
    - **usersController/**: defines and handles actions for creating and retrieving user information. Users are linked to profiles .
  - **routes/**: Defines the routes that map to the controller functions.
    - **authenticationRoutes.js**: initializes routes for authentication controllers
    - **gamesRoutes.js**: initializes routes for game-related controllers
    - **rolesManagementRoutes.js**: initializes routes for role-related controlelrs
    - **announcementRoutes.js**: initializes routes for announcement-related controllers
    - **authenticationRoutes.js**: initializes routes for authentication-related controllers
    - **messageRoutes.js**: initializes routes for message-related controllers
    - **profileRoutes.js**: initializes routes for profile-related controllers
    - **userRoutes.js**: initializes routes for ueser-related controllers

- **configs/**: Stores configuration files and templates.

- **db/**: Contains scripts for database connections and initial setup.

- **models/**: Holds Mongoose models that define the structure for various data entities.

  - includes models for users, announcements, chats, games, messages, profiles, roles, and users

- **utils/**: Includes utility functions and middleware for common tasks.

- **scripts/**: Contains scripts for deployment and other operational tasks.

- **test/**: Comprises test files for testing the application components.

- **Dockerfile**: The Docker configuration file for creating containerized instances of the application.

- **docker-compose.yml**: Used for defining and running multi-container Docker applications.

- **ecosystem.config.js**: Configuration file for application deployment and process management.

- **nginx.conf**: Configuration for NGINX, which may be used as a reverse proxy or for other purposes.

- **package.json** & **package-lock.json**: Define project dependencies and lock down their versions.

- **README.md**: The markdown file providing an overview and documentation for the project.

## API Endpoint Documentation

These are the endpoints that the frontend uses to connect with the MongoDB Database.

### Announcement Routes

- **POST `/api/announcement/add`**: Adds a new announcement. Access restricted to admins only.

- **PUT `/api/announcement/addMessage`**: Adds a message to an existing announcement. Access restricted to admins only.

- **DELETE `/api/announcement/:id`**: Deletes an announcement by its ID. Access restricted to admins only.

- **GET `/api/announcement/:id`**: Retrieves an announcement by its ID. Access available to all users.

### CAS Authentication Routes

- **GET `/api/auth/cas/login`**: Initiates the CAS login process. Accessible to all users to start their authentication journey.

- **GET `/api/auth/cas/logout`**: Handles CAS logout, ensuring users can securely end their session.

### Game Routes

- **POST `/api/game/addGame`**: Adds a new game. Access restricted to admins only.

- **GET `/api/games`**: Retrieves all games. Accessible to all users.

- **GET `/api/game/:id`**: Fetches a game by its ID. Accessible to all users.

- **PUT `/api/game/:id`**: Updates a game by its ID. Access restricted to admins only.

- **DELETE `/api/game/:id`**: Removes a game by its ID. Access restricted to admins only.

- **GET `/api/newgames`**: Retrieves all new games. Accessible to all users.

- **GET `/api/oldgames`**: Retrieves all old games. Accessible to all users.

- **GET `/api/games/user`**: Fetches games associated with the current user. Accessible to all users.

- **GET `/api/games/userAll`**: Retrieves all games including those associated with the current user. Accessible to all users.

### Message Routes

- **POST `/api/message/addMessage`**: Adds a new message. Access restricted to admins only.

- **GET `/api/messages`**: Retrieves all messages. Accessible to all users.

- **GET `/api/message/:id`**: Fetches a message by its ID. Accessible to all users.

- **PUT `/api/message/:id`**: Updates a message by its ID. Access restricted to admins only.

- **DELETE `/api/message/:id`**: Deletes a message by its ID. Access restricted to admins only.

- **GET `/api/message/replies/:messageId`**: Retrieves all replies to a specific message. Accessible to all users.

- **PUT `/api/message/replies/addReply`**: Adds a reply to a message. Access restricted to admins only.

### Profile Routes

- **GET `/api/profileid/:id`**: Retrieves a profile by its ID. Accessible to all users.

- **GET `/api/profile`**: Fetches the profile of the currently authenticated user. Accessible to all users.

- **GET `/api/profile/:username`**: Retrieves a profile by username. Accessible to all users.

- **PUT `/api/profile`**: Updates the profile of the currently authenticated user. Access restricted to all users.

- **GET `/api/profile/search`**: Allows searching for profiles based on specific criteria. Accessible to all users.

### Roles Management Routes

- **GET `/api/roles`**: Retrieves all roles. Accessible to all users.
- **POST `/api/roles`**: Creates a new role. Access restricted to admins only.

- **GET `/api/roles/:id`**: Retrieves a specific role by its ID. Accessible to all users.
- **PUT `/api/roles/:id`**: Updates a specific role by its ID. Access restricted to admins only.
- **DELETE `/api/roles/:id`**: Deletes a specific role by its ID. Access restricted to admins only.

- **GET `/api/users/:userid/roles`**: Retrieves all roles assigned to a specific user. Accessible to all users.
- **POST `/api/users/:userid/roles`**: Assigns a role to a user. Access restricted to admins only.
- **DELETE `/api/users/:userid/roles`**: Removes a role from a user. Access restricted to admins only.

### User Routes

- **GET `/api/auth/status`**: Checks the login status of the current user. Accessible to all users.

- **GET `/api/user/getUser`** and **GET `/api/user`**: Retrieves the current user's information. Accessible to all users.

- **PUT `/api/user/updateUserGames`**: Updates the game information for the current user. Access restricted to admins only.

## Testing Instructions

Certainly! I'll revise the backend testing instructions to align with the provided details, ensuring consistency and accuracy:

---

## Backend Testing Instructions

### Setting Up for Testing

Our backend testing framework is built on Mocha and Chai, along with several supportive libraries that enhance our testing capabilities. These libraries allow for comprehensive testing of our Node.js/Express application.

#### Dependencies Installation

If the project dependencies don't already include the testing libraries, you can install them by executing:

```bash
npm install --save-dev mocha chai chai-http sinon sinon-chai supertest istanbul express-http-proxy
```

This command will install Mocha and Chai for writing and executing tests, along with additional libraries for HTTP requests, mocking, spying, and coverage reporting.

### Test Structure and Environment

- **Modularized Tests**: Tests are organized based on the database schema. This modularization helps in grouping tests that interact with similar schemas, making our tests more maintainable and understandable.

- **Test Directory**: All test files should be located in the `test` directory. This organization ensures a clean separation between the application code and its tests.

### Running Tests and the Server

- **Dual Terminal Approach**: Running backend tests requires two terminal instances within the backend directory:
  - One terminal should run the server using `npm start`. This starts your Node.js/Express application.
  - The other terminal runs the test suite via `npm run test`.

### Available NPM Scripts

- **Running Tests**: To execute the entire test suite, use:

  ```bash
  npm run test
  ```

- **Watching Tests**: For development purposes, you can watch for file changes and re-run tests automatically:

  ```bash
  npm run test:watch
  ```

- **Test Coverage**: To check the test coverage of your code, use:

  ```bash
  npm run test:coverage
  ```

  This script utilizes Istanbul for generating coverage reports.

### Writing Effective Tests

- **Unit Tests**: Focus on testing individual parts of the application in isolation, such as specific functions or middleware.

- **Mocking and Spying**: Utilize `sinon` and `sinon-chai` for mocking and spying functionalities, especially when you need to test functions or methods that depend on external services or have side effects.

Sure! Let's include and explain this specific test case in the backend testing instructions for the README file:

---

## Backend Testing Instructions with Mocha and Chai

### Example Test Case Explanation

As part of our backend testing suite, we have tests that validate the functionality of our API endpoints. Here is an example of a test case written using Mocha and Chai for testing user authentication:

```javascript
describe("User", () => {
  // Mock user instance
  const user = {
    profile: new mongoose.Types.ObjectId().toHexString(),
  };

  it("login status can be validated", async () => {
    // Get user status
    const res = await chai.request(server).get("/api/auth/status").send({});

    expect(res).to.have.status(StatusCodes.UNAUTHORIZED);
    expect(res.body).to.have.property("message", "Not logged in");
  });
});
```

In this test:

- **Describe Block**: We use `describe` to define a test suite for a specific part of our application. In this case, it's for testing user-related functionalities.

- **Mock Data**: The `user` object is a mock instance of a user. It uses `mongoose.Types.ObjectId().toHexString()` to simulate a user profile ID, which is a common pattern in MongoDB-based applications.

- **Test Case**: The `it` function defines an individual test. This specific test checks the login status of a user.

- **Making Requests**: We use `chai.request(server)` to send an HTTP request to our server. This test is sending a GET request to `/api/auth/status`.

- **Assertions**:
  - The first `expect` statement checks if the HTTP response status is `UNAUTHORIZED (401)`. This status code is expected when a user is not logged in.
  - The second `expect` statement checks if the response body contains a specific message indicating the user is not logged in.

This example demonstrates how to structure a test case to validate API endpoints, specifically for checking authentication status in this case.

### Writing Your Tests

1. **Create Test Files**: Place your test files in the `test` directory. Each file can contain multiple `describe` blocks, each focusing on a different aspect of your application.

2. **Running Tests**: To execute your tests, run `npm test` in your terminal. This will run all tests in your `test` directory.

3. **Test Isolation**: Make sure each test is independent and doesn't rely on the state created by other tests. This might involve setting up and tearing down mock data for each test.

4. **Asynchronous Code**: Handle asynchronous operations in your tests using `async/await`, as shown in the example.
