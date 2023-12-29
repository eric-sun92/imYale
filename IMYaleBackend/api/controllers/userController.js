const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const LocalUser = require("@models/Users/LocalUser");
const SES = require("@aws-sdk/client-ses");
const Profile = require("@models/Profile");
const passport = require("passport");
const config = require("@config");
const yalies = require("yalies");
const yalies_api = new yalies.API(config.yaliesAPIKey);

const SECRET_KEY = process.env.JWT_SECRET || "default";
if (SECRET_KEY === "default") {
  console.log(
    "\x1b[33m%s\x1b[0m",
    "WARNING: JWT_SECRET environment variable not set, using 'default' as the key. Please make sure to set the variable"
  );
}

/**
 * Checks the login status of the current user.
 *
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
exports.checkLoginStatus = async function (req, res) {
  if (!req.user)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Not logged in" });
  return res.status(StatusCodes.OK).json({ message: "Logged in" });
};

/**
 * Retrieves the chat list for the current user.
 *
 * @param {Express.Request} req - The request object, expecting a user session.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
exports.getChatList = async function (req, res) {
  if (!req.user)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Not logged in" });
  const user = await LocalUser.findOne({ username: req.user });
  const profile = await Profile.findOne({ _id: user.profile });
  return res.status(StatusCodes.OK).json({ chats: profile.chats });
};

/**
 * Retrieves the user data for the currently logged-in user.
 *
 * @param {Express.Request} req - The request object, expecting a user session.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */

exports.getUser = async function (req, res) {
  if (!req.session.user) {
    console.log("Not logged in");
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "User not authenticated" });
  }

  try {
    // Assuming `user` is the field in Profile schema that references the User model
    const profile = await Profile.findOne({
      netid: req.session.user.user.netid,
    }).populate("user");
    console.log(profile);
    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Profile not found" });
    } else {
      res.status(StatusCodes.OK).json({ user: profile });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

/**
 * Updates the list of games for the currently logged-in user.
 *
 * @param {Express.Request} req - The request object containing the game ID and user session.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
exports.updateUserGames = async function (req, res) {
  const netid = req.session.user.user.netid;
  const { gameId } = req.body; // Game ID to add or remove

  try {
    const profile = await Profile.findOne({ netid: netid });

    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    // Check if gameId is already in the user's games array
    const gameIndex = profile.games.indexOf(gameId);

    if (gameIndex > -1) {
      // Game is in the array, remove it
      profile.games.splice(gameIndex, 1);
    } else {
      // Game is not in the array, add it
      profile.games.push(gameId);
    }

    await profile.save(); // Save the updated profile

    res
      .status(StatusCodes.OK)
      .json({ message: "User games updated successfully", user: profile });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating user games", error: error.message });
  }
};
