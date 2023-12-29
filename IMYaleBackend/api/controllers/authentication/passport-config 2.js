const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
var MongoDBStore = require('connect-mongodb-session')(session);
var config = require("@config");

// Initialize passport strategies
var strategies = require("@controllers/authentication/strategies");
strategies(passport);

module.exports = (app, isProduction) => {
    const store = new MongoDBStore({
        uri: config.mongodb.connection,
        collection: 'sessions'
    });

    if (isProduction) {
        app.use(
            session({
                store: store,
                secret: config.session.secret,
                resave: false,
                saveUninitialized: true,
                secure: true,
                cookie: {
                    maxAge: config.session.cookie.maxAge,
                    secure: config.session.cookie.secure,
                },
            })
        );
        app.use(
            cors({
                credentials: true,
                // clientIp
                origin: process.env.CLIENT_URL,
                methods: "GET, POST, PUT, DELETE"
            })
        )
    } else {
        app.use(session({
            secret: "f9aisdf",
            resave: false,
            saveUninitialized: true,
            store: store,
            cookie: {
                maxAge: config.session.cookie.maxAge,
                secure: false,

            }
        }));


        app.use(
            cors({
                credentials: true,
                origin: "http://localhost:3000",
                methods: "GET, POST, PUT, DELETE",
            })
        );
    }

    // Set up strategies here
    require("./strategies/local")(passport);
    require("./strategies/yale-cas")(passport);


    app.use(passport.initialize());
    app.use(passport.session());
}

