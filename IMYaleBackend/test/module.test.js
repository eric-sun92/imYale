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

const Game = require('@models/Game');
const { StatusCodes } = require('http-status-codes');

describe('User', () => {
    it('can add & edit games', () => {

    });
});