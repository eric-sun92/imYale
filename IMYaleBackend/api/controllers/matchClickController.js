const MatchClick = require("@models/MatchClicks");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("./errors/errors");

exports.recordMatchBlockClick = async function (req, res) {
  // console.log("recordMatchBlockClick");
  // Extract variationId from the request body
  const variationID = req.body.variationID;
  console.log(variationID);

  // Handle adding a MatchBlock click
  try {
    const clickRecord = await MatchClick.create({ variationId: variationID });
    console.log(clickRecord);
    // Check if the clickRecord object and its ID are defined
    if (!clickRecord || !clickRecord._id) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error recording click" });
    }
    // Send back the ID of the newly created click record
    res.status(StatusCodes.CREATED).json({ id: clickRecord._id });
  } catch (error) {
    console.log(error);
    // Handle any errors
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred", error: error.message });
  }
};

exports.chooseMatchBlockVariation = async function (req, res) {
  // Epsilon value - defines the exploration rate
  const epsilon = 0.1;
  console.log("chooseMatchBlockVariation");

  try {
    // Step 1: Aggregate the click data for each variation
    const variationsData = await MatchClick.aggregate([
      {
        $group: {
          _id: "$variationId",
          clicks: { $sum: 1 },
          // Add more fields as necessary
        },
      },
      { $sort: { clicks: -1 } },
    ]);

    // Step 2: Implement the MAB logic
    let chosenVariation;
    // console.log(Math.random());
    let random = Math.random();
    // console.log(random);
    if (random < epsilon) {
      // console.log(random);
      // Exploration: Randomly choose a variation
      // console.log("length", variationsData.length);
      const randomIndex = Math.floor(Math.random() * variationsData.length);
      // console.log("random", randomIndex);
      chosenVariation = variationsData[randomIndex]._id;
    } else {
      // Exploitation: Choose the best performing variation
      chosenVariation = variationsData[0]._id;
    }

    // Send back the chosen variation
    res.status(StatusCodes.OK).json({ variationId: chosenVariation });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred", error: error.message });
  }
};
