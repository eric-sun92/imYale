// Import and setup dependancies
const chai = require("chai");
const sinonChai = require("sinon-chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");
const passport = require("passport");
chai.use(sinonChai);
chai.use(chaiHttp);
const { expect } = chai;
let server = "http://localhost:4000";
const mongoose = require("mongoose");

const Game = require("@models/Game");
const { StatusCodes } = require("http-status-codes");


describe('Games', function () {
    const gameId = new mongoose.Types.ObjectId().toHexString();
    // Mock game object
    const gameData = {
        team1: "Pierson",
        team2: "Davenport",
        scoreHome: 0,
        scoreAway: 0, 
        winner: "None", 
        team1Users: [], 
        team2Users: [], 
        sport: "Soccer",
        date: new Date(), 
        completed: false,
        isPlayOff: false,
        announcement: new mongoose.Types.ObjectId().toHexString() // Add the announcement ID to game data
    };

  it("can be created", async function () {
    // Attempt to create a new game
    const res = await chai
      .request(server)
      .post("/api/game/addGame")
      .send(gameData);
    // Assert status code
    expect(res).to.have.status(StatusCodes.CREATED);
  });

  it("(ALL) can be retrieved", async () => {
    // Make api call to retrieve all games
    const res = await chai.request(server).get("/api/games");

    expect(res).to.have.status(StatusCodes.OK);
    expect(res._body).to.have.property("games");
  });

  it("can handle case: no game found", async () => {
    // Make api call to retrieve a game by id
    try {
      // Attempt to get a game with a non-existent ID
      const res = await chai.request(server).get(`/api/game/${gameId}`);
      expect(res).to.have.status(StatusCodes.NOT_FOUND);
    } catch (error) {
      console.log(error);
    }
  });

  it("handle invalid update requests", async () => {
    // Make call to database with empty request
    const res = await chai.request(server).put(`/api/game/${gameId}`).send({});
    // Assert status and message
    expect(res).to.have.status(404);
    expect(res.body).to.have.property(
      "message",
      `Cannot update Item with id=${gameId}. Maybe Item was not found!`
    );
  });

  it("can be updated by id", async () => {
    // Make api call to update game by id
    const res = await chai
      .request(server)
      .put(`/api/game/${gameId}`)
      .send(gameData);
    // Assert status message
    expect(res.body).to.have.property(
      "message",
      `Cannot update Item with id=${gameId}. Maybe Item was not found!`
    );
  });

  it("cannot be removed by invalid id", async () => {
    // Make api call to delete game
    const res = await chai.request(server).delete(`/api/game/${gameId}`);
    // Assert status message and code
    expect(res).to.have.status(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).to.have.property("message", "Error removing game");
  });

  it("(NEW) can fetched", async () => {
    // Attempt api call to fetch new games
    const res = await chai.request(server).get("/api/newgames");
    // Assert status message and body
    expect(res).to.have.status(StatusCodes.OK);
    expect(res.body).to.have.property("games");
  });

  it("(OLD) can fetched", async () => {
    // Attempt api call to fetch old games
    const res = await chai.request(server).get("/api/oldgames");
    // Assert status message and body
    expect(res).to.have.status(StatusCodes.OK);
    expect(res.body).to.have.property("games");
  });

  it("should not be fetched for user not logged in", async () => {
    // Mock req body
    const req = {
      session: {
        user: {
          user: {
            netid: new mongoose.Types.ObjectId().toHexString(),
          },
        },
      },
    };
    // Attempt api call to retrieve user games
    const res = await chai.request(server).get("/api/games/user").send(req);
    // Assert res body
    expect(res).to.have.status(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).to.have.property(
      "message",
      "Error retrieving user's games"
    );
  });

  it("(ALL) should not be fetched for user not logged in", async () => {
    // Mock req body
    const req = {
      session: {
        user: {
          user: {
            netid: new mongoose.Types.ObjectId().toHexString(),
          },
        },
      },
    };
    // Attempt api call to retrieve user games
    const res = await chai.request(server).get("/api/games/userAll").send({});
    // Assert res body
    expect(res).to.have.status(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).to.have.property(
      "message",
      "Error retrieving user's games"
    );
  });
});
