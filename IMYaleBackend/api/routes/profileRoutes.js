const profileController = require("@controllers/profileController"); // Adjust the path as necessary
module.exports = function (app) {
  app.route("/api/profileid/:id").get(profileController.getProfilebyId);
  app.route("/api/profile").get(profileController.getProfile);
  app.route("/api/profile/:username").get(profileController.getProfile);
  app.route("/api/profile").put(profileController.updateProfile);
  app.route("/api/profile/search").get(profileController.searchProfiles);
};
