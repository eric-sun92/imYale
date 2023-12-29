const Message = require("@models/Message");
const { StatusCodes } = require("http-status-codes");
// const CustomError = require('@utils/custom-error'); // Assuming you have a custom error handler

/**
 * Adds a new message.
 *
 * @param {Express.Request} req - The request object containing message details.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 * @throws {BadRequestError} - If the required text field is missing.
 * @throws {InternalServerError} - If there's an error creating the message.
 */
exports.addMessage = async function (req, res) {
  try {
    // Extract the text from req.body
    const { text, visibility } = req.body;

    // Check if the text is provided
    if (!text) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Text is required for the message" });
    }

    // console.log(req.session);
    // Get the sender's profile from the session
    console.log("here:", req.session);
    const senderProfile = req.session.user.user.profile;

    // Create a new message with the provided text and sender from the session
    const message = await Message.create({
      text,
      sender: senderProfile,
      visibility: visibility,
    });

    console.log(message);
    if (!message || !message._id) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error creating message" });
    }

    res.status(StatusCodes.CREATED).json({ id: message._id, message });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating message", error: error.message });
  }
};

/**
 * Retrieves all messages.
 *
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 * @throws {InternalServerError} - If there's an error retrieving messages.
 */
exports.getAllMessages = async function (req, res) {
  try {
    const messages = await Message.find({});
    res.status(StatusCodes.OK).json({ messages });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving messages", error: error.message });
  }
};

/**
 * Retrieves a message by its ID.
 *
 * @param {Express.Request} req - The request object containing the message ID in the parameters.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 * @throws {NotFoundError} - If no message with the given ID is found.
 * @throws {InternalServerError} - If there's an error retrieving the message.
 */

exports.getMessage = async function (req, res) {
  const { id: messageId } = req.params;

  try {
    const message = await Message.findOne({ _id: messageId });

    if (!message) {
      throw new Error.NotFoundError(`No message with id : ${messageId}`);
    }

    res.status(StatusCodes.OK).json({ message });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving message", error: error.message });
  }
};

/**
 * Updates a message by its ID.
 *
 * @param {Express.Request} req - The request object containing the message ID in the parameters and update data in the body.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 * @throws {BadRequestError} - If the update data is empty.
 * @throws {NotFoundError} - If no message with the given ID is found.
 * @throws {InternalServerError} - If there's an error updating the message.
 */

exports.updateMessage = async function (req, res) {
  const { id: messageId } = req.params;

  if (!req.body) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Data to update can not be empty!" });
  }

  try {
    const message = await Message.findByIdAndUpdate(messageId, req.body, {
      new: true,
    });

    if (!message) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: `Cannot update message with id=${messageId}. Maybe message was not found!`,
      });
    }

    res.status(StatusCodes.OK).json({
      message: "Message was updated successfully",
      updatedMessage: message,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating message with id=" + messageId,
      error: error.message,
    });
  }
};

/**
 * Deletes a message by its ID.
 *
 * @param {Express.Request} req - The request object containing the message ID in the parameters.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 * @throws {NotFoundError} - If no message with the given ID is found.
 * @throws {InternalServerError} - If there's an error deleting the message.
 */
exports.deleteMessage = async function (req, res) {
  const { id: messageId } = req.params;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      throw new Error.NotFoundError(`No message with id : ${messageId}`);
    }

    await Message.deleteOne({ _id: messageId });
    res.status(StatusCodes.OK).json({ msg: "Success! Message removed." });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting message", error: error.message });
  }
};

/**
 * Retrieves replies to a specific message.
 *
 * @param {Express.Request} req - The request object containing the parent message ID.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 * @throws {NotFoundError} - If the parent message is not found.
 * @throws {InternalServerError} - If there's an error fetching the replies.
 */
exports.getReplies = async function (req, res) {
  const messageId = req.params.messageId;

  try {
    // Find the message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Verify each reply exists and filter out any that don't
    const verifiedReplies = await Promise.all(
      message.replies.map(async (replyId) => {
        const exists = await Message.exists({ _id: replyId });
        return exists ? replyId : null;
      })
    );

    const existingReplyIds = verifiedReplies.filter((id) => id !== null);

    // Fetch and return the existing replies without populating the sender
    const replies = await Message.find({ _id: { $in: existingReplyIds } });

    res.status(200).json(replies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching replies", error: error.message });
  }
};

/**
 * Adds a reply to a message.
 *
 * @param {Express.Request} req - The request object containing the original and reply message IDs.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 * @throws {NotFoundError} - If the original message or reply message is not found.
 * @throws {InternalServerError} - If there's an error adding the reply.
 */
exports.addReply = async function (req, res) {
  const { messageId, replyId } = req.body; // Assuming you get the original message ID and the reply message ID from the request body
  console.log(messageId, replyId);
  try {
    console.log(replyId);
    // Find the original message
    const originalMessage = await Message.findById(messageId);
    if (!originalMessage) {
      return res.status(404).json({ message: "Original message not found" });
    }

    // Optionally, check if the reply message exists
    const replyExists = await Message.exists({ _id: replyId });
    if (!replyExists) {
      return res.status(404).json({ message: "Reply message not found" });
    }

    // Add the reply ID to the original message's replies array
    originalMessage.replies.push(replyId);
    await originalMessage.save();
    console.log(originalMessage);
    res
      .status(200)
      .json({ message: "Reply added successfully", originalMessage });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding reply", error: error.message });
  }
};
