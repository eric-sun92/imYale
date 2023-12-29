// Import and setup dependancies
const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const passport = require('passport');
chai.use(sinonChai);
chai.use(chaiHttp);
const { StatusCodes } = require('http-status-codes');
const { expect } = chai;
let server = "http://localhost:4000"


describe('Yale user', async () => {
    it('can log in using CAS', async () => {
        // Create a sinon sandbox to mock a GOOD passport authentication
        const sandbox = sinon.createSandbox();
        // Patch passport.authenticate to simulate successful authentication
        sandbox.stub(passport, 'authenticate').callsFake((strategy, callback) => {
            // Mock user data
            const user = {
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password123",
                role: "admin",
                verificationToken: "randomVerificationToken",
                isVerified: false,
                verified: null,
                passwordToken: null,
                passwordTokenExpirationDate: null,
            };
            callback(null, user, null);
            return (req, res, next) => {};
        });
        // Make request to login route
        res = await chai.request(server).get('/api/auth/cas/login');
        expect(res).to.have.status(200);
        // Ensure redirection occurs
        expect(res).to.redirect;
        const expectedUrlPattern = /^https:\/\/secure\.its\.yale\.edu\/cas\/login\?service=http%3A%2F%2Flocalhost%3A4000%2Fapi%2Fauth%2Fcas%2Flogin$/;
        expect(res.redirects[0]).to.match(expectedUrlPattern)

        // Clean up the sinon sandbox
        sandbox.restore();
    })
    
    // it('should not log in with no user information', async () => {
    //     // Create a sinon sandbox to mock a GOOD passport authentication
    //     const sandbox = sinon.createSandbox();
    //     // Patch passport.authenticate to simulate a BAD authentication
    //     sandbox.stub(passport, 'authenticate').callsFake((strategy, callback) => {
    //         // Mock empty user data
    //         const user = {};
    //         callback("ERROR", user, null);
    //         return (req, res, next) => {};
    //     });
    //     // Make request to login route
    //     res = await chai.request(server).get('/api/auth/cas/login');
    //     console.log(res)
    //     expect(res).to.have.status(401);
    //     expect(res._body).to.have.property('error', 'Authentication failed');

    //     // Clean up the sinon sandbox
    //     sandbox.restore();
    // });

    it('not logged in', async () => {
            // Ensure Login status is negative when user is not logged in
            res = await chai.request(server).get('/api/auth/status');
            expect(res).to.have.status(StatusCodes.UNAUTHORIZED);
            expect(res._body).to.have.property('message', 'Not logged in');
    });
})