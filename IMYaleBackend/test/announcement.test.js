const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const mongoose = require("mongoose");
chai.use(chaiHttp);
const { StatusCodes } = require("http-status-codes");
const Announcement = require("../models/Announcements");
const Message = require("../models/Message");

const server = "http://localhost:4000";

describe("Announcements", function () {
  let announcementId = new mongoose.Types.ObjectId().toHexString();
  const messageId = new mongoose.Types.ObjectId().toHexString(); // Example message ID

  // Example data for an announcement
  const announcementData = {
    messages: [messageId], // Assuming these are valid message IDs
  };

  it("should create a new announcement", async function () {
    const res = await chai
      .request(server)
      .post("/api/announcement/add")
      .send(announcementData);
    announcementId = res.body.id;
    expect(res).to.have.status(StatusCodes.CREATED);
    expect(res.body).to.have.property("announcement");
  });

  it("should retrieve an announcement", async () => {
    const res = await chai
      .request(server)
      .get(`/api/announcement/${announcementId}`);
    expect(res).to.have.status(StatusCodes.OK);
    expect(res.body).to.have.property("announcement");
  });

  //   it("should add a message to an announcement", async () => {
  //     // First, create a new message
  //     const messageData = {
  //       text: "Sample message text",
  //       visibility: "private", // Assuming 'visibility' is a required field
  //     };

  //     const messageRes = await chai
  //       .request(server)
  //       .post("/api/message/addMessage")
  //       .send(messageData);

  //     expect(messageRes).to.have.status(StatusCodes.CREATED);
  //     const messageId = messageRes.body.id; // Extract the ID of the newly created message

  //     // Now, add this message to an announcement
  //     const res = await chai
  //       .request(server)
  //       .put("/api/announcement/addMessage")
  //       .send({ announcementId: announcementId, messageId: messageId });

  //     expect(res).to.have.status(StatusCodes.OK);
  //     expect(res.body).to.have.property(
  //       "message",
  //       "Message added to announcement"
  //     );
  //   });

  it("should handle case: no announcement found", async () => {
    const res = await chai
      .request(server)
      .get(`/api/announcement/${new mongoose.Types.ObjectId().toHexString()}`);

    expect(res).to.have.status(StatusCodes.NOT_FOUND);
  });

  it("should delete an announcement", async () => {
    const res = await chai
      .request(server)
      .delete(`/api/announcement/${announcementId}`);

    expect(res).to.have.status(StatusCodes.OK);
    expect(res.body).to.have.property(
      "message",
      "Announcement successfully deleted"
    );
  });
});
