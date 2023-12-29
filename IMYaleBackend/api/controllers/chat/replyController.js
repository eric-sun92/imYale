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
// exports.createChat = async function (req, res, next) {
//     if (!req.user) return next(new AuthorizationError("Not logged in"));
//     const user = await BaseUser.findOne({ username: req.user });
//     console.log(user)
//     if (!await checkPermission(user.role, "imyale.chat.create")) return next(new PermissionError("Not allowed to create chats"));
//
//     const { participants } = req.body;
//
//     // Check that all participants exist
//     const profiles = await Profile.find({ _id: { $in: participants } });
//     if (profiles.length !== participants.length) {
//         return res.status(StatusCodes.BAD_REQUEST).json({ message: "One or more participants does not exist" });
//     }
//
//     // Create the chat
//     const chat = await Chat.create({ participants: participants });
//
//     // Add the chat to each participant's chats
//     for (const profile of profiles) {
//         profile.chats.push(chat._id);
//         await profile.save();
//     }
//
//     return res.status(StatusCodes.CREATED).json({ chat });
// }
