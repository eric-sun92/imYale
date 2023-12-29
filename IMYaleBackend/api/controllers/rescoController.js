const Resco = require("@models/Rescos"); // Adjust the path as needed
const { StatusCodes } = require("http-status-codes");

exports.getAllRescos = async function (req, res) {
  const rescos = await Resco.find({});
  res.status(StatusCodes.OK).json({ rescos });
};

exports.editScore = async function (req, res) {
  const { winner, loser, sport } = req.body;

  try {
    let rescoWinner = await Resco.findOne({ name: winner });
    let rescoLoser = await Resco.findOne({ name: loser });

    if (!rescoWinner) {
      rescoWinner = new Resco({
        name: winner, // Modify as needed
        basketballWins: 0,
        basketballLosses: 0,
        footballWins: 0,
        footballLosses: 0,
        soccerWins: 0,
        soccerLosses: 0,
        volleyballWins: 0,
        volleyballLosses: 0,
      });
    }
    if (!rescoLoser) {
      rescoLoser = new Resco({
        name: loser, // Modify as needed
        basketballWins: 0,
        basketballLosses: 0,
        footballWins: 0,
        footballLosses: 0,
        soccerWins: 0,
        soccerLosses: 0,
        volleyballWins: 0,
        volleyballLosses: 0,
      });
    }

    const scoreFieldWin = `${sport}Wins`; // e.g., "basketballWins"
    const scoreFieldLosses = `${sport}Losses`; // e.g., "basketballWins"
    if (
      rescoWinner[scoreFieldWin] !== undefined &&
      rescoLoser[scoreFieldLosses] !== undefined
    ) {
      rescoWinner[scoreFieldWin] += 1;
      rescoLoser[scoreFieldLosses] += 1;
      await rescoWinner.save();
      await rescoLoser.save();
      res
        .status(StatusCodes.OK)
        .json({
          message: "Score updated successfully",
          rescoWinner,
          rescoLoser,
        });
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid sport or score type" });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating score", error: error.message });
  }
};
