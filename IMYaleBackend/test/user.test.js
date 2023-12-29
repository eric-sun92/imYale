// Import and setup dependancies
const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const passport = require('passport');
chai.use(sinonChai);
chai.use(chaiHttp);
const { expect } = chai;
const LocalUser = require('@models/Users/LocalUser');
let server = "http://localhost:4000";
const mongoose = require('mongoose');
const config = require("@config");


const { StatusCodes } = require('http-status-codes');

describe('User', () => {
    // Mock user instance
    const user = {
        profile: new mongoose.Types.ObjectId().toHexString()
    }
    it('login status can be validated', async() => {
        // Get user status
        const res = await chai.request(server)
        .get('/api/auth/status')
        .send({});

        expect(res).to.have.status(StatusCodes.UNAUTHORIZED);
        expect(res.body).to.have.property('message', 'Not logged in');
    });
})
