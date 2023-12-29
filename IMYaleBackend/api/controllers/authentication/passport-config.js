const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require("@config");

// Initialize passport strategies
const strategies = require("@controllers/authentication/strategies");
strategies(passport);


/**
 * Configures the Express application with necessary middlewares and Passport strategies.
 * 
 * @param {Express.Application} app - The Express application instance to configure.
 * @description
 * This function sets up various middlewares including session management with MongoDB,
 * CORS for handling cross-origin requests, and Passport for authentication.
 * It initializes and configures Passport with defined strategies and sets session and 
 * CORS configurations based on the environment (production or development).
 * 
 * @example
 * // Usage in the main server file
 * const express = require('express');
 * const app = express();
 * require('path/to/this/file')(app);
 */

module.exports = (app) => {
    let isProduction = process.env.NODE_ENV === "production";
    isProduction = false //change this later
    const sessionStore = new MongoDBStore({
        uri: config.mongodb.connection,
        collection: 'sessions'
    });

    // Session configuration
    const sessionConfig = {
        store: sessionStore,
        secret: config.session.secret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: config.session.cookie.maxAge,
            secure: isProduction ? config.session.cookie.secure : false, // secure cookie based on environment
        }
    };

    // CORS configuration
    const corsOptions = {
        credentials: true,
        origin: isProduction ? process.env.CLIENT_URL : "http://localhost:3000",
        methods: "GET, POST, PUT, DELETE"
    };

    app.use(session(sessionConfig));
    app.use(cors(corsOptions));

    // Set up Passport strategies
    require("./strategies/local")(passport);
    require("./strategies/yale-cas")(passport);

    app.use(passport.initialize());
    app.use(passport.session());
};
