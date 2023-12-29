// Import and setup dependancies
const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const passport = require('passport');
chai.use(sinonChai);
chai.use(chaiHttp);
const { expect } = chai;
let server = "http://localhost:4000"
const mongoose = require('mongoose');
const {Message} = require('@models/Message');
const config = require("@config");


const Game = require('@models/Game');
const { StatusCodes } = require('http-status-codes');
const e = require('express');

describe('Messages', () => {
    let messageId;

    beforeEach(async () => {
        // Connect to the test database or use an in-memory database
        // Clear or reset the database
        await mongoose.connect(config.mongodb.connection);
    });

    afterEach(async () => {
    // Disconnect from the database after each test
    await mongoose.connection.close();
    });

    it('can be posted', async ()=>{
        const response = await chai
        .request(server)
        .post('/api/message/addMessage')
        .send({ 
            text: 'Test message', 
            visibility: 'public',
            session: {
                user: {
                    user: {
                        profile: new mongoose.Types.ObjectId().toHexString()
                    }
                }
            }
        });
  
        expect(response).to.have.status(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).to.have.property('message', 'Error creating message');
    });

    it('messages can be retrieved', async ()=>{
        const res = await chai
        .request(server)
        .get('/api/messages');
        
        expect(res).to.have.status(StatusCodes.OK);
    });
});