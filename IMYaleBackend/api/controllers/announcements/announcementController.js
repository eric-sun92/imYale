const Announcement = require("@models/Announcements");
const Message = require("@models/Message");
const { StatusCodes } = require("http-status-codes");
// const CustomError = require('@utils/custom-error');

/**
 * Adds a new announcement.
 *
 * @param {Express.Request} req - The request object containing the announcement details.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the announcement is added.
 * @throws {InternalServerError} - Thrown when there's an error creating the announcement.
 */
exports.addAnnouncement = async function (req, res) {
  try {
    const messages = req.body.messages || [];
    const validMessageIds = await Promise.all(
      messages.map(async (id) => {
        const messageExists = await Message.exists({ _id: id });
        return messageExists ? id : null;
      })
    );

    const filteredMessageIds = validMessageIds.filter((id) => id !== null);

    const announcement = await Announcement.create({
      messages: filteredMessageIds,
    });

    if (!announcement || !announcement._id) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error creating announcement" });
    }

    res
      .status(StatusCodes.CREATED)
      .json({ id: announcement._id, announcement });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating announcement", error: error.message });
  }
};
/**
 * Deletes an announcement by its ID.
 *
 * @param {Express.Request} req - The request object containing the announcement ID in the parameters.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the announcement is deleted.
 * @throws {NotFoundError} - Thrown when the announcement with the specified ID is not found.
 * @throws {InternalServerError} - Thrown when there's an error deleting the announcement.
 */

exports.deleteAnnouncement = async function (req, res) {
  const { id: announcementId } = req.params;

  try {
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      throw new Error.NotFoundError(
        `No announcement with id: ${announcementId}`
      );
    }

    await Announcement.deleteOne({ _id: announcementId });
    res
      .status(StatusCodes.OK)
      .json({ message: "Announcement successfully deleted" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting announcement", error: error.message });
  }
};

/**
 * Retrieves an announcement by its ID.
 *
 * @param {Express.Request} req - The request object containing the announcement ID in the parameters.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the announcement details.
 * @throws {NotFoundError} - Thrown when the announcement with the specified ID is not found.
 * @throws {InternalServerError} - Thrown when there's an error retrieving the announcement.
 */
exports.getAnnouncement = async function (req, res) {
  const { id: announcementId } = req.params;

  try {
    const announcement = await Announcement.findById(announcementId).populate({
      path: "messages",
      model: "Message",
      populate: {
        path: "sender",
        model: "Profile",
      },
    });

    if (!announcement) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `No announcement with id: ${announcementId}` });
    }

    res.status(StatusCodes.OK).json({ announcement });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving announcement", error: error.message });
  }
};

/**
 * Adds a message to an existing announcement.
 *
 * @param {Express.Request} req - The request object containing the announcement ID and message ID.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the message is added to the announcement.
 * @throws {NotFoundError} - Thrown when either the announcement or message is not found.
 * @throws {InternalServerError} - Thrown when there's an error adding the message to the announcement.
 */
exports.addMessageToAnnouncement = async function (req, res) {
  try {
    const { announcementId, messageId } = req.body;
    console.log(req.body);

    // Validate that the announcement exists
    const announcement = await Announcement.findById(announcementId);
    console.log(announcement);
    if (!announcement) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Announcement not found" });
    }

    // Validate that the message exists
    const messageExists = await Message.exists({ _id: messageId });
    if (!messageExists) {
      console.log("message not found");
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Message not found" });
    }

    // Add the message ID to the announcement's messages array
    announcement.messages.push(messageId);
    await announcement.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "Message added to announcement", announcement });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error adding message to announcement",
      error: error.message,
    });
  }
};
