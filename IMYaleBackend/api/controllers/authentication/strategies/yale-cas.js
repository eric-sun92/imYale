const CasStrategy = require('passport-cas2').Strategy;
const CASUser = require('@models/Users/CASUser');
const BaseUser = require('@models/Users/BaseUser');
const Profile = require('@models/Profile');
const config = require("@config");
const yalies =  require("yalies");
const yalies_api = new yalies.API(config.yaliesAPIKey);

/**
 * Configures Passport with a CAS strategy for user authentication.
 * 
 * @param {Object} passport - The Passport instance to configure.
 * @example
 * // Usage in an Express application
 * const passport = require('passport');
 * require('path/to/this/file')(passport);
 * 
 * @description
 * This function sets up Passport to use the CAS strategy for authentication.
 * The CAS strategy will handle user logins, creating new user records if they
 * don't exist, and fetching user details from the Yalies API. It expects a 
 * `netid` and `profile` from CAS, uses these to check if the user exists in
 * the database, and creates a new user and profile if not.
 */

module.exports = function(passport) {
    passport.use('yalecas', new CasStrategy({
            casURL: 'https://secure.its.yale.edu/cas',
        },
        // This is the `verify` callback
        async function(netid, profile, done) {
            try {
                let user = await BaseUser.findOne({ username: netid });
                if (!user) {
                    // get user profile via yalies
                    let people = await yalies_api.people({
                        filters: {
                            netid: netid
                        }
                    });
                    if (people.length !== 1) {
                        return done(null, false, {message: 'No such user, or too many users'});
                    }

                    const person = people[0];
                    const user = new CASUser({
                        username: netid,
                        netid: netid,
                        email: person.email,
                        verified: Date.now(),
                        isVerified: true,
                        roles: ["user"]
                    });

                    const newUser = await user.save();



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
                        user: newUser._id,
                        username: netid
                    });

                    const newProfile = await profile.save();
                    const updatedUser = await CASUser.findByIdAndUpdate(newUser._id, {profile: newProfile._id});
                    console.log(updatedUser);
                    return done(null, updatedUser);
                } else {
                    return done(null, user);
                }
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }
    ));
}