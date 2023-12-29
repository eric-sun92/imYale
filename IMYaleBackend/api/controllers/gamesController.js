const Game = require("@models/Game");
const { StatusCodes } = require("http-status-codes");
const Announcement = require("@models/Announcements"); // Assuming this for the Announcement model
const Profile = require("@models/Profile"); // Ensure correct path
const { NotFoundError } = require("./errors/errors");

/**
 * Adds a new game.
 *
 * @param {Express.Request} req - The request object containing game details.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
exports.addGame = async function (req, res) {
  // Handle adding a game
  const game = await Game.create(req.body);

  // Check if the game object and its ID are defined
  if (!game || !game._id) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating game" });
  }
  // Send back the ID of the newly created game
  res.status(StatusCodes.CREATED).json({ id: game._id, game: game });
};

/**
 * Retrieves all games.
 *
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
exports.getAllGames = async function (req, res) {
  const games = await Game.find({});
  res.status(StatusCodes.OK).json({ games });
};

/**
 * Retrieves old (completed) games.
 *
 * @param {Express.Request} req - The request object with optional query parameters.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
exports.getOldGames = async function (req, res) {
  // Extract the 'completed' query parameter, defaulting to 'true'
  const { completed = "false" } = req.query;

  try {
    // Fetch games based on the 'completed' status
    const games = await Game.find({ completed: true });

    res.status(StatusCodes.OK).json({ games });
  } catch (error) {
    // Handle any errors that occur during the database query
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving games", error: error.message });
  }
};

/**
 * Retrieves new (ongoing) games.
 *
 * @param {Express.Request} req - The request object with optional query parameters.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
exports.getNewGames = async function (req, res) {
  try {
    // Fetch games based on the 'completed' status
    const games = await Game.find({ completed: false });

    res.status(StatusCodes.OK).json({ games });
  } catch (error) {
    // Handle any errors that occur during the database query
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving games", error: error.message });
  }
};

/**
 * Retrieves games associated with a specific user.
 *
 * @param {Express.Request} req - The request object, expecting a user session.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
exports.getUserGames = async function (req, res) {
  try {
    const netid = req.session.user.user.netid; // Adjust this path as needed
    // Fetch the user and their games array
    const user = await Profile.findOne({ netid: netid });

    console.log(user);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    if (!user.games || user.games.length === 0) {
      return res.status(StatusCodes.OK).json({ games: [] });
    }

    // Fetch games that are in the user's games array
    const existingGames = await Game.find({
      _id: { $in: user.games },
      completed: false,
    });

    // Filter out games that no longer exist
    const existingGameIds = existingGames.map((game) => game._id.toString());
    const updatedGames = user.games.filter((gameId) =>
      existingGameIds.includes(gameId.toString())
    );

    // Update user's games array if there are changes
    if (updatedGames.length !== user.games.length) {
      user.games = updatedGames;
      await user.save();
    }

    res.status(StatusCodes.OK).json({ games: existingGames });
  } catch (error) {
    // console.error("Error in getUserGames:", error); // Log the error for debugging
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving user's games", error: error.message });
  }
};

/**
 * Retrieves all games associated with a specific user.
 *
 * @param {Express.Request} req - The request object, expecting a user session.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
exports.getUserGamesAll = async function (req, res) {
  try {
    const netid = req.session.user.user.netid; // Adjust this path as needed
    // Fetch the user and their games array
    const user = await Profile.findOne({ netid: netid });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    if (!user.games || user.games.length === 0) {
      return res.status(StatusCodes.OK).json({ games: [] });
    }

    // Fetch games that are in the user's games array
    const existingGames = await Game.find({ _id: { $in: user.games } });

    // Filter out games that no longer exist
    const existingGameIds = existingGames.map((game) => game._id.toString());
    const updatedGames = user.games.filter((gameId) =>
      existingGameIds.includes(gameId.toString())
    );

    //TODO: filter out games where the user is not a player

    // Update user's games array if there are changes
    if (updatedGames.length !== user.games.length) {
      user.games = updatedGames;
      await user.save();
    }

    res.status(StatusCodes.OK).json({ games: existingGames });
  } catch (error) {
    // console.error("Error in getUserGames:", error); // Log the error for debugging
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving user's games", error: error.message });
  }
};

/**
 * Retrieves a specific game by its ID.
 *
 * @param {Express.Request} req - The request object containing the game ID.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
exports.getGame = async function (req, res) {
  // handle retrieving a game
  const { id: gameId } = req.params;
  const game = await Game.findOne({ _id: gameId });

  if (!game) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `No product with id : ${gameId}` });
    // throw new NotFoundError(`No product with id : ${gameId}`);
  } else {
    res.status(StatusCodes.OK).json({ game });
  }
};

/**
 * Updates a game by its ID.
 *
 * @param {Express.Request} req - The request object containing the game ID and update data.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
exports.updateGame = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  } else {
    const id = req.params.id;

    Game.findOneAndUpdate({ _id: id }, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Item with id=${id}. Maybe Item was not found!`,
          });
        } else {
          res.send({ message: "Item was updated successfully", data: data });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating Item with id=" + id,
        });
      });
  }
};

/**
 * Removes a game and its associated announcement by game ID.
 *
 * @param {Express.Request} req - The request object containing the game ID.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
exports.removeGame = async function (req, res) {
  const { id: gameId } = req.params;

  try {
    const game = await Game.findById(gameId);

    if (!game) {
      throw new Error.NotFoundError(`No game with id: ${gameId}`);
    }

    // Check if the game has an associated announcement and delete it
    if (game.announcement) {
      await Announcement.deleteOne({ _id: game.announcement });
    }

    // Now delete the game
    await Game.deleteOne({ _id: gameId });

    res
      .status(StatusCodes.OK)
      .json({ msg: "Success! Game and associated announcement removed." });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error removing game", error: error.message });
  }
};
