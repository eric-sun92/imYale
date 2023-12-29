const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const LocalUser = require('@models/Users/LocalUser');
const Profile = require('@models/Profile');
const passport = require("passport");
const config = require("@config");
const yalies =  require("yalies");
const yalies_api = new yalies.API(config.yaliesAPIKey);
const BaseUser = require('@models/Users/BaseUser');

const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const client = new SESClient(config);

const SECRET_KEY = process.env.JWT_SECRET || "default";
if (SECRET_KEY === "default") {
    console.log('\x1b[33m%s\x1b[0m', "WARNING: JWT_SECRET environment variable not set, using 'default' as the key. Please make sure to set the variable");
}


/*
  User Login:
    - Check if user exists
    - Check if password is correct
    - Save the user to session
    - Generate a JWT for the user
    - Return the created token
  */
/**
 * @api {post}
 * /user/login
 * @apiName userLogin
 * @apiGroup User
 * @apiDescription Logs in a user
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 * @apiSuccess {String} token JWT token
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYzE1NzA0YzEwNjEwMDAwMDAwMSIsI
 *       m5hbWUiOiJUZXN0IiwibGFzdG5hbWUiOiJUZXN0IiwiZW1haWwiOiJUZXN0IiwiaWF0IjoxNjQwMjQwMjQxfQ.
 *     }
 */

exports.LocalLogin = (req, res, next) => {
    passport.authenticate("local",
        {
            failureRedirect: config.hostClient + "/login",
        }, (err, user, info) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred' });
            }
            if (!user) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' });
            }

            // Store user information in session upon successful authentication
            req.session.user = {user}; // Adjust according to the user object structure
            console.log(req.user)
            return res.redirect(config.hostClient + "/home");
        })(req, res, next);
}





exports.createLocalUser = async function (req, res) {
    const { email, password } = req.body;

    try {
        if (password.length < 8) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password must be at least 8 characters" });
        }
        const userExists = await LocalUser.findOne({ email });
        if (userExists)
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "A user with this email already exists" });

        // check for email that ends in @yale.edu
        if (!email.endsWith("@yale.edu"))
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email must be a Yale email" });

        let people = await yalies_api.people({
            filters: {
                email: email
            }
        });
        if (people.length !== 1) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "No such user, or too many users" });
        }

        const person = people[0];

        // Create a User
        const user = new LocalUser({
            username: person.netid,
            email: email,
            password: password,
            roles: ["unverified"],
            verificationToken: verificationToken,
        });


        user.roles = ["default"];
        var savedUser = await user.save();
        var verificationToken = jwt.sign({ id: savedUser._id }, SECRET_KEY, {
            expiresIn: '1d',
        });

        user.verificationToken = verificationToken;
        await savedUser.save();
        //send verification email via SES
        const params = {
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: `<html><body><h1>Verify your email</h1><p>Click <a href="${config.hostAPI}/api/auth/local/verify/accept?token=${verificationToken}">here</a> to verify your email</p></body></html>`,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Verify your email',
                },
            },
            Source: 'noreply@imyale.lilbillbiscuit.com',
        };

        const command = new SendEmailCommand(params);
        const response = await client.send(command);

        return res.status(StatusCodes.CREATED).json({ message: "User created successfully. Check email for verification" });

    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred" });
    }
};


// Brendon: AWS SES Config – send reset password email to user when api is called

// Function to send password reset email using Amazon SES
exports.passwordReset = async function (req, res) {
    try {
        const email = req.body.email;

        // Find user by email
        const user = await LocalUser.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Generate a unique token for resetting password
        const passwordToken = jwt.sign({ id: user._id }, SECRET_KEY, {
            expiresIn: '1h',
        });

        if (user.passwordTokenExpirationDate > Date.now()) {
            return res.status(401).send({ error: 'Password reset already requested' });
        }

        // Update user model with reset token and expiration
        user.passwordToken = passwordToken;
        user.passwordTokenExpirationDate = new Date(Date.now() + 3600000);
        await user.save();

        // Email parameters for SES
        const params = {
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: `<html><body><h1>Verify your email</h1><p>Click <a href="${config.hostAPI}/api/auth/local/passwordreset/accept?token=${passwordToken}">here</a> to change your password</p></body></html>`,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Password reset request',
                },
            },
            Source: 'noreply@imyale.lilbillbiscuit.com',
        };

        // Send email
        const command = new SendEmailCommand(params);
        const response = await client.send(command);
        res.send({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error in passwordReset function', error);
        res.status(500).send({ error: error.message });
    }
};

exports.confirmPasswordReset = async function (req, res) {
    try {
        const { token } = req.query;
        const { password } = req.body;

        // Decode token
        const decoded = jwt.verify(token, SECRET_KEY);

        // Find user by id
        const user = await LocalUser.findOne({ _id: decoded.id });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Check if token is expired
        if (user.passwordTokenExpirationDate < Date.now()) {
            return res.status(401).send({ error: 'Token expired' });
        }

        // Update password
        user.password = password;
        user.passwordToken = null;
        user.passwordTokenExpirationDate = null;
        await user.save();

        res.send({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error in confirmPasswordReset function', error);
        res.status(500).send({ error: error.message });
    }
}

exports.userVerify = async function (req, res) {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await LocalUser.findOne({ _id: decoded.id });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }

        // Check if user is already verified
        if (user.isVerified) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User already verified' });
        }

        let people = await yalies_api.people({
            filters: {
                email: user.email
            }
        });

        if (people.length !== 1) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "No such user, or too many users" });
        }

        const person = people[0];
        const profile = new Profile({
            first_name: person.first_name,
            last_name: person.last_name,
            middle_name: person.middle_name,
            preferred_name: person.preferred_name,
            netid: person.netid,
            college: person.college,
            year: person.year,
            major: person.major,
            profilePic: person.image,
            user: user._id,
            username: user.username
        });
        const newProfile = await profile.save();

        // Verify the user
        user.isVerified = true;
        user.verified = Date.now();
        user.roles = ["user"];
        user.profile = newProfile._id;
        await user.save();

        // redirect to frontend
        res.redirect(config.hostClient + "/createprofile");

    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred' });
    }
}



exports.checkUserVerified = async function (req, res) {
    const { id: userId } = req.user;

    try {
        const user = await LocalUser.findOne({ _id: userId });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }

        return res.status(StatusCodes.OK).json({ isVerified: user.isVerified });

    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred' });
    }
}