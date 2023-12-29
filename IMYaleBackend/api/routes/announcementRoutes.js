var announcementController = require("@controllers/announcements/announcementController.js");

module.exports = function (app) {
  // route for adding a game
  //route for adding an announcement
  app
    .route("/api/announcement/add")
    .post(announcementController.addAnnouncement);

  app
    .route("/api/announcement/addMessage")
    .put(announcementController.addMessageToAnnouncement);

  // Route for deleting an announcement by id
  app
    .route("/api/announcement/:id")
    .delete(announcementController.deleteAnnouncement);

  // Route for getting an announcement by id
  app
    .route("/api/announcement/:id")
    .get(announcementController.getAnnouncement);
};
