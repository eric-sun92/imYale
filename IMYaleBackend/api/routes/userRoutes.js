var userController = require("@controllers/userController");

module.exports = function (app) {
  app.route("/api/auth/status").get(userController.checkLoginStatus);
  app.route("/api/user/getUser").get(userController.getUser);
  app.route("/api/user").get(userController.getUser);
  app.route("/api/user/updateUserGames").put(userController.updateUserGames);
};
