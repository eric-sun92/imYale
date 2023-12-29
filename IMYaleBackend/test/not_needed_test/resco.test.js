// Import and setup dependancies
const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const passport = require('passport');
chai.use(sinonChai);
chai.use(chaiHttp);
const { expect } = chai;
const Resco = require('@models/Rescos');
let server = "http://localhost:4000";
const mongoose = require('mongoose');
const config = require("@config");


const { StatusCodes } = require('http-status-codes');

describe('Rescos', () => {
    beforeEach(async () => {
        // Connect to the test database or use an in-memory database
        // Clear or reset the database
        await mongoose.connect(config.mongodb.connection);
        await Resco.deleteMany({});
    });

    afterEach(async () => {
    // Disconnect from the database after each test
    await mongoose.connection.close();
    });

    const sampleRescos = [
        { name: 'Pierson', basketballWins: 3, basketballLosses: 1, footballWins: 5, footballLosses: 0, soccerWins: 8, soccerLosses: 2, volleyballWins: 1, volleyballLosses: 0 },
        { name: 'Davenport', basketballWins: 2, basketballLosses: 2, footballWins: 1, footballLosses: 3, soccerWins: 0, soccerLosses: 1, volleyballWins: 9, volleyballLosses: 0 },
    ];

    // Rescos will not be found
    it('can be retrieved', async() => {
        await Resco.create(sampleRescos);
        // Make a request to the API endpoint
        const res = await chai.request(server).get('/api/rescos');

        expect(res).to.have.status(StatusCodes.NOT_FOUND);
    });

    // Winner and Loser 
    it('scores can be edited', async () => {
        await Resco.create(sampleRescos);
        // Sample request body
        const req = {
            winner: 'PS',
            loser: 'DP',
            sport: 'Soccer',
        };
        const res = await chai.request(server)
        .put('/api/editscore')
        .send(req);
        // Assert res body and status code
        expect(res).to.have.status(StatusCodes.BAD_REQUEST);
        expect(res.body).to.have.property('message', 'Invalid sport or score type');
    });
});