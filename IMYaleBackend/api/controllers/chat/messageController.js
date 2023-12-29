const { StatusCodes } = require('http-status-codes');

const Profile = require('@models/Profile');
const Message = require('@models/Message');
const BaseUser = require('@models/Users/BaseUser');
const Chat = require('@models/Chats');
const roles = require('@controllers/authentication/roles');
const {PermissionError, ValidationError, AuthorizationError} = require('@controllers/errors/errors');

const config = require("@config");
const {checkPermission} = require("../authentication/roles");

/*
    Send a new message to a chat
    POST /api/chats/:chatId/messages
    @param chatId: the id of the chat to send the message to
    @param text: the content of the message
    @param sender: the id of the sender
    @return the message that was sent, including the messageId and timestamp
 */

exports.sendMessage = async function (req, res, next) {
    if (!req.user) return next(new AuthorizationError("Not logged in"));
    const user = await BaseUser.findOne({ username: req.user });
    if (!await checkPermission(user.roles, "imyale.chat.send")) return next(new PermissionError("Not allowed to send messages"));

    const { chatId } = req.params;
    const { text, sender } = req.body;

    // Check that the chat exists
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) return res.status(StatusCodes.NOT_FOUND).json({ message: "Chat not found" });

    // Check that the user is in the chat
    if (!chat.participants.includes(user.profile)) return res.status(StatusCodes.FORBIDDEN).json({ message: "Not in chat" });

    // Check that the sender is in the chat
    if (!chat.participants.includes(sender)) return res.status(StatusCodes.FORBIDDEN).json({ message: "Sender not in chat" });

    // Create the message
    const message = await Message.create({ chat: chatId, text: text, sender: sender });

    // Add the message to the chat
    chat.messages.push(message._id);
    await chat.save();

    return res.status(StatusCodes.CREATED).json({ message });
}

/*
    Get the messages in a chat
    GET /api/chats/:chatId/messages
    @param chatId: the id of the chat to get messages from
    @oaram limit: the maximum number of messages to return
    @param page: the page of messages to return
 */

exports.getMessages = async function (req, res, next) {
    if (!req.user) return next(new AuthorizationError("Not logged in"));
    const user = await BaseUser.findOne({ username: req.user });
    if (!await checkPermission(user.roles, "imyale.chat.get")) return next(new PermissionError("Not allowed to get messages"));

    const { chatId } = req.params;
    const { limit, page } = req.query;

    // Check that the chat exists
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) return res.status(StatusCodes.NOT_FOUND).json({ message: "Chat not found" });

    // Check that the user is in the chat
    if (!chat.participants.includes(user.profile)) return res.status(StatusCodes.FORBIDDEN).json({ message: "Not in chat" });

    // Get the messages
    const messages = await Message.find({ chat: chatId }).limit(limit).skip(limit * page);

    return res.status(StatusCodes.OK).json({ messages });
}

/*
    Retrieve a specific message
    GET /api/chats/:chatId/messages/:messageId

    @param chatId: the id of the chat to get the message from
    @param messageId: the id of the message to retrieve

 */

exports.getMessage = async function (req, res, next) {
    if (!req.user) return next(new AuthorizationError("Not logged in"));
    const user = await BaseUser.findOne({ username: req.user });
    if (!await checkPermission(user.roles, "imyale.chat.get")) return next(new PermissionError("Not allowed to get messages"));

    const { chatId, messageId } = req.params;

    // Check that the chat exists
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) return res.status(StatusCodes.NOT_FOUND).json({ message: "Chat not found" });

    // Check that the user is in the chat
    if (!chat.participants.includes(user.profile)) return res.status(StatusCodes.FORBIDDEN).json({ message: "Not in chat" });

    // Get the message
    const message = await Message.findOne({ _id: messageId });
    if (!message) return res.status(StatusCodes.NOT_FOUND).json({ message: "Message not found" });

    return res.status(StatusCodes.OK).json({ message });
}

/*
    Update a message
    PUT /api/chats/:chatId/messages/:messageId
    @param chatId: the id of the chat to update the message in
    @param messageId: the id of the message to update
    @param text: the new text of the message
 */

exports.updateMessage = async function (req, res, next) {
    if (!req.user) return next(new AuthorizationError("Not logged in"));
    const user = await BaseUser.findOne({ username: req.user });
    if (!await checkPermission(user.roles, "imyale.chat.update")) return next(new PermissionError("Not allowed to update messages"));

    const { chatId, messageId } = req.params;
    const { text } = req.body;

    // Check that the chat exists
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) return res.status(StatusCodes.NOT_FOUND).json({ message: "Chat not found" });

    // Check that the user is in the chat
    if (!chat.participants.includes(user.profile)) return res.status(StatusCodes.FORBIDDEN).json({ message: "Not in chat" });

    // Get the message
    const message = await Message.findOne({ _id: messageId });
    if (!message) return res.status(StatusCodes.NOT_FOUND).json({ message: "Message not found" });

    // Check that the user is the sender
    if (message.sender !== user.profile) return res.status(StatusCodes.FORBIDDEN).json({ message: "Not the sender" });

    // Update the message
    message.text = text;
    await message.save();

    return res.status(StatusCodes.OK).json({ message });
}

/*
    Delete a message
    DELETE /api/chats/:chatId/messages/:messageId
    @param chatId: the id of the chat to delete the message from
    @param messageId: the id of the message to delete
 */

exports.deleteMessage = async function (req, res, next) {
    if (!req.user) return next(new AuthorizationError("Not logged in"));
    const user = await BaseUser.findOne({ username: req.user });
    if (!await checkPermission(user.roles, "imyale.chat.delete")) return next(new PermissionError("Not allowed to delete messages"));

    const { chatId, messageId } = req.params;

    // Check that the chat exists
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) return res.status(StatusCodes.NOT_FOUND).json({ message: "Chat not found" });

    // Check that the user is in the chat
    if (!chat.participants.includes(user.profile)) return res.status(StatusCodes.FORBIDDEN).json({ message: "Not in chat" });

    // Get the message
    const message = await Message.findOne({ _id: messageId });
    if (!message) return res.status(StatusCodes.NOT_FOUND).json({ message: "Message not found" });

    // Check that the user is the sender
    if (message.sender !== user.profile) return res.status(StatusCodes.FORBIDDEN).json({ message: "Not the sender" });

    // Delete the message
    await message.delete();

    return res.status(StatusCodes.OK).json({ message });
}
