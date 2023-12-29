const utilfunctions = require("@utils/utilfunctions");

module.exports = function (app) {
  var userController = require("@controllers/userController");
  app.route("/api/auth/status").get(userController.checkLoginStatus);
  app.route("/api/user/getUser").get(userController.getUser);
  app.route("/api/user").get(userController.getUser);
  app.route("/api/user/updateUserGames").put(userController.updateUserGames);

  var rescoController = require("@controllers/rescoController");
  app.route("/api/editscore").put(rescoController.editScore);
  app.route("/api/getRescos").get(rescoController.getAllRescos);

  var chatController = require("@controllers/chat/chatController");
  app.route("/api/chat").post(chatController.createChat);
  app
    .route("/api/chat/:chatId")
    .get(chatController.getChatDetails)
    .post(chatController.updateChat)
    .delete(chatController.deleteChat);

  var messageController = require("@controllers/announcements/messageController.js");
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

  var messageController = require("@controllers/chat/messageController");
  app.route("/api/chat/:chatId/message").post(messageController.sendMessage);
  app.route("/api/chat/:chatId/messages").get(messageController.getMessages);
  app
    .route("/api/chat/:chatId/message/:messageId")
    .get(messageController.getMessage)
    .put(messageController.updateMessage)
    .delete(messageController.deleteMessage);

  //var profileController = require("@controllers/profileController");
  app.route("/api/profile").get(profileController.getProfile);
  app.route("/api/profile/:username").get(profileController.getProfile);
  app.route("/api/profile").put(profileController.updateProfile);
  app.route("/api/profile/search").get(profileController.searchProfiles);

  // Test controller
  var testController = require("@controllers/test/testController");
  app.route("/api").post(testController.homeTest);
};
