// Local Strategy for authenticating user
var LocalStrategy = require('passport-local').Strategy;
const LocalUser = require('@models/Users/LocalUser');


module.exports = function (passport) {
    passport.use('local', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async function (email, password, done) {
            const user = await LocalUser.findOne({ email: email});
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        }
    ));
}