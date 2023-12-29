var gamesController = require("@controllers/gamesController");
var matchClickControllers = require("@controllers/matchClickController");

module.exports = function (app) {
  // route for adding a game
  app.route("/api/game/addGame").post(gamesController.addGame);
  app.route("/api/games").get(gamesController.getAllGames);
  // route for getting a game by id
  app.route("/api/game/:id").get(gamesController.getGame);

  // route for updating a game by id
  app.route("/api/game/:id").put(gamesController.updateGame);

  // route for removing a game by id
  app.route("/api/game/:id").delete(gamesController.removeGame);

  //route or getting all new games
  app.route("/api/newgames").get(gamesController.getNewGames);

  //route or getting all old games
  app.route("/api/oldgames").get(gamesController.getOldGames);

  app.route("/api/games/user").get(gamesController.getUserGames);
  app.route("/api/games/userAll").get(gamesController.getUserGamesAll);

  //route for posting a match block click
  app
    .route("/api/games/matchblockclicks")
    .post(matchClickControllers.recordMatchBlockClick);

  app
    .route("/api/games/choosematchblockvariation")
    .get(matchClickControllers.chooseMatchBlockVariation);
};
