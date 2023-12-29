require("module-alias/register");
const config = require("@config");
const express = require("express");
const app = express();
const port = process.env.PORT || config.port || 4000;

const cookieParser = require("cookie-parser");

const connectDB = require("./db/connect");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use cookie-parser middleware
app.use(cookieParser());

// Initialize error handling
require("@controllers/errors/errors").initializeErrorHandling(app);

// Set up passport for session management
require("@controllers/authentication/passport-config")(app);

// Middleware for logging - You can keep these for debugging purposes
// app.use((req, res, next) => {
//     console.log('Cookies: ', req.session.user.username);
//     // console.log('User: ', req.session); // Optional chaining in case session is not set
//     next();
// });
// app.use((req, res, next) => {
//     console.log('Session ID: ', req.sessionID);
//     console.log('Session Data: ', req.session);
//     next();
// });

// get all js files in routes folder, and require each one
require("fs")
  .readdirSync("./api/routes")
  .forEach(function (file) {
    if (file.match(/\.js$/) !== null && file !== "routes.js") {
      var name = file.replace(".js", "");
      // console.log(name)
      require("./api/routes/" + name)(app);
    }
  });
// require("./api/routes/routes")(app);

// function mockSessionMiddleware(req, res, next) {
//   req.session = {
//     user: {
//       user: {
//         profile: "mockProfileId",
//         // ... other mock session data ...
//       },
//     },
//   };
//   next();
// }
// app.use(mockSessionMiddleware);

// Start the server
module.exports.listen = async () => {
  await connectDB(config.mongodb.connection);
  app.listen(port, () => {
    console.log(`PID ${process.pid}: API listening on port ${port}`);
  });
};

// Initialize the server when file is executed directly
if (require.main === module) {
  module.exports.listen().then(() => console.log("Server started"));
}

// Export an instance of the app for testing
module.exports.app = app;
