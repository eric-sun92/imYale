var messageController = require("@controllers/announcements/messageController.js");

module.exports = function (app) {
  //route for adding a message
  app.route("/api/message/addMessage").post(messageController.addMessage);
  // Route for getting all messages
  app.route("/api/messages").get(messageController.getAllMessages);
  // Route for getting a message by id
  app.route("/api/message/:id").get(messageController.getMessage);
  // Route for updating a message by id
  app.route("/api/message/:id").put(messageController.updateMessage);
  // Route for deleting a message by id
  app.route("/api/message/:id").delete(messageController.deleteMessage);
  // Route for getting all replies to a message
  app
    .route("/api/message/replies/:messageId")
    .get(messageController.getReplies);
  app.route("/api/message/replies/addReply").put(messageController.addReply);
};
