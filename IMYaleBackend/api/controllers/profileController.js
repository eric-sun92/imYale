const { StatusCodes } = require("http-status-codes");
const Profile = require("@models/Profile");
const config = require("@config");
const yalies = require("yalies");
const yalies_api = new yalies.API(config.yaliesAPIKey);
const {
  PermissionError,
  ValidationError,
  AuthorizationError,
} = require("@controllers/errors/errors");

/**
 * Retrieves the profile of the currently logged-in user.
 *
 * @param {Express.Request} req - The request object, expecting a user session.
 * @param {Express.Response} res - The response object.
 * @param {Function} next - The next middleware function in the Express stack.
 * @returns {Promise<void>}
 * @throws {AuthorizationError} - If the user is not logged in.
 */
exports.getProfile = async (req, res, next) => {
  if (!req.session?.user?.username) {
    return next(new AuthorizationError("Not logged in"));
  }

  const { username } = req.session.user;
  const profile = await Profile.findOne({ username: username });
  if (!profile) {
    return next(new AuthorizationError("Not logged in"));
  }
  // remove the user field
  delete profile.user;
  return res.status(StatusCodes.OK).json({ profile });
};

/**
 * Updates the profile of the currently logged-in user.
 *
 * @param {Express.Request} req - The request object containing update data.
 * @param {Express.Response} res - The response object.
 * @param {Function} next - The next middleware function in the Express stack.
 * @returns {Promise<void>}
 * @throws {AuthorizationError} - If the user is not logged in.
 * @throws {ValidationError} - If the update operation is invalid.
 */
exports.updateProfile = async (req, res, next) => {
  if (!req.session?.user?.username) {
    return next(new AuthorizationError("Not logged in"));
  }

  const { username } = req.session.user;
  const profile = await Profile.findOne({ username: username });
  if (!profile) {
    return next(new AuthorizationError("Not logged in"));
  }

  // smart way of updating profile
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "first_name",
    "middle_name",
    "last_name",
    "preferred_name",
    "netid",
    "college",
    "major",
    "year",
    "profilePic",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return next(new ValidationError("Invalid updates"));
  }

  updates.forEach((update) => (profile[update] = req.body[update]));
  await profile.save();
  return res.status(StatusCodes.OK).json({ profile });
};

/*

 */

/**
 * Searches for profiles based on a query.
 *
 * @param {Express.Request} req - The request object containing the search query.
 * @param {Express.Response} res - The response object.
 * @param {Function} next - The next middleware function in the Express stack.
 * @returns {Promise<void>}
 * @throws {AuthorizationError} - If the user is not logged in.
 */
exports.searchProfiles = async (req, res, next) => {
  if (!req.session?.user?.username) {
    return next(new AuthorizationError("Not logged in"));
  }

  const { username } = req.session.user;
  const profile = await Profile.findOne({ username: username });
  if (!profile) {
    return next(new AuthorizationError("Not logged in"));
  }

  const { query } = req.body;
  const profiles = await Profile.find({ $text: { $search: query } });
  profiles.forEach((profile) => delete profile.user);
  return res.status(StatusCodes.OK).json({ profiles });
};

/**
 * Retrieves a profile by its ID.
 *
 * @param {Express.Request} req - The request object containing the profile ID.
 * @param {Express.Response} res - The response object.
 * @param {Function} next - The next middleware function in the Express stack.
 * @returns {Promise<void>}
 * @throws {NotFoundError} - If the profile is not found.
 */
exports.getProfilebyId = async function (req, res, next) {
  const profileId = req.params.id;
  try {
    const profile = await Profile.findById(profileId);
    console.log(profile);

    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Profile not found" });
    }

    res.status(StatusCodes.OK).json({ profile });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving profile", error: error.message });
  }
};
