const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const User = require("@models/Users/CASUser");
const SES = require("@aws-sdk/client-ses");
const passport = require("passport");
const config = require("@config");

// var CasStrategy = require('passport-cas2').Strategy;
// var cas = new CasStrategy({
//     casURL: 'https://secure.its.yale.edu/cas'
// });

const SECRET_KEY = process.env.JWT_SECRET || "default";
if (SECRET_KEY === "default") {
  console.log(
    "\x1b[33m%s\x1b[0m",
    "WARNING: JWT_SECRET environment variable not set, using 'default' as the key. Please make sure to set the variable"
  );
}

/**
 * Authenticates a user using Yale's CAS system.
 *
 * @param {Express.Request} req - The request object from Express.
 * @param {Express.Response} res - The response object from Express.
 * @param {Function} next - The next middleware function in the Express stack.
 * @returns {void}
 * @throws {InternalServerError} - If there is an error during authentication.
 * @throws {UnauthorizedError} - If authentication fails.
 *
 * @example
 * // Example of use within an Express route
 * router.get('/login', authController.CASLogin);
 */

exports.CASLogin = (req, res, next) => {
  passport.authenticate("yalecas", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Store user information in session upon successful authentication
    req.session.user = { user }; // Adjust according to the user object structure
    console.log(req.user);
    // You can now redirect the user or send a response as needed
    // For example, redirect to a page with user data
    const userData = JSON.stringify(user); // Convert user data to a string
    const encodedUserData = encodeURIComponent(userData); // Encode the user data
    res.redirect(`${config.hostAPI}/userdata?data=${encodedUserData}`); // Redirect with the user data
  })(req, res, next);
};

exports.CASLogout = async function (req, res) {
  console.log("logging out");
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err);
      return res
        .status(500)
        .send({ error: "Could not log out, please try again." });
    }

    // Passport's req.logout method with a callback
    req.logout((logoutErr) => {
      if (logoutErr) {
        console.error("Logout error:", logoutErr);
        return res.status(500).send({ error: "Error logging out" });
      }

      // Optional: Clear the cookie on client side
      res.clearCookie("connect.sid"); // Adjust cookie name based on your setup

      // Redirect to CAS logout URL or send a response
      res.redirect(`${config.hostAPI}/cas/logout`);
    });
  });
};
