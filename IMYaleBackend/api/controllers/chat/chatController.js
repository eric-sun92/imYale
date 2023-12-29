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
    Creates a new chat with the given participants
    @param participants: an array of profile ids
 */
exports.createChat = async function (req, res, next) {
    if (!req.session?.user?.username) return next(new AuthorizationError("Not logged in"));

    const user = await BaseUser.findOne({ username: req.session.user.username });
    
    console.log(user)
    if (!await checkPermission(user.roles, "imyale.chat.create")) return next(new PermissionError("Not allowed to create chats"));

    const { participants } = req.body;

    // Check that all participants exist
    const profiles = await Profile.find({ _id: { $in: participants } });
    

    if (profiles.length !== participants.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "One or more participants does not exist" });
    }

    // Create the chat
    const chat = await Chat.create({ participants: participants });

    // Add the chat to each participant's chats
    for (const profile of profiles) {
        profile.chats.push(chat._id);
        await profile.save();
    }

    return res.status(StatusCodes.CREATED).json({ chat });
}



/*
    retrieve chat details for a given chat id
    /api/chats/:chatId
    @param chatId: the id of the chat to retrieve
 */

exports.getChatDetails = async function (req, res, next) {
    if (!req.user) return next(new AuthorizationError("Not logged in"));
    const user = await BaseUser.findOne({ username: req.user });
    if (!await checkPermission(user.roles, "imyale.chat.get")) return next(new PermissionError("Not allowed to get chats"));

    const { chatId } = req.params;

    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) return res.status(StatusCodes.NOT_FOUND).json({ message: "Chat not found" });

    // Check that the user is in the chat
    if (!chat.participants.includes(user.profile)) return res.status(StatusCodes.FORBIDDEN).json({ message: "Not in chat" });

    return res.status(StatusCodes.OK).json({ chat });
}

/*
    update a chat's details
    PUT /api/chats/:chatId
    @param chatId: the id of the chat to update
    @param participants: the new participants of the chat
 */

exports.updateChat = async function (req, res, next) {
    if (!req.user) return next(new AuthorizationError("Not logged in"));
    const user = await BaseUser.findOne({ username: req.user });
    if (!await checkPermission(user.roles, "imyale.chat.update")) return next(new PermissionError("Not allowed to update chats"));

    const { chatId } = req.params;
    const { participants } = req.body;

    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) return res.status(StatusCodes.NOT_FOUND).json({ message: "Chat not found" });

    // Check that the user is in the chat
    if (!chat.participants.includes(user.profile)) return res.status(StatusCodes.FORBIDDEN).json({ message: "Not in chat" });

    // Check that all participants exist
    const profiles = await Profile.find({ _id: { $in: participants } });
    if (profiles.length !== participants.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "One or more participants does not exist" });
    }

    // Update the chat
    chat.participants = participants;
    await chat.save();

    return res.status(StatusCodes.OK).json({ chat });
}

/*
    delete a chat
    DELETE /api/chats/:chatId
    @param chatId: the id of the chat to delete
 */

exports.deleteChat = async function (req, res, next) {
    if (!req.user) return next(new AuthorizationError("Not logged in"));
    const user = await BaseUser.findOne({ username: req.user });
    if (!await checkPermission(user.roles, "imyale.chat.delete")) return next(new PermissionError("Not allowed to delete chats"));

    const { chatId } = req.params;

    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) return res.status(StatusCodes.NOT_FOUND).json({ message: "Chat not found" });

    // Check that the user is in the chat
    if (!chat.participants.includes(user.profile)) return res.status(StatusCodes.FORBIDDEN).json({ message: "Not in chat" });

    // Delete the chat
    await chat.delete();

    return res.status(StatusCodes.OK).json({ message: "Chat deleted" });
}