// Import and setup dependancies
const chai = require("chai");
const sinonChai = require("sinon-chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");
chai.use(sinonChai);
chai.use(chaiHttp);
const { expect } = chai;
let server = "http://localhost:4000";

// Import express app
const { app } = require("../app");

// Import required modules
const express = require("express");
const passport = require("passport");

describe("Middleware setup", () => {
  it("should use express.urlencoded middleware with { extended: true }", () => {
    const urlencodedSpy = sinon.spy(express, "urlencoded");
    app.use(express.urlencoded({ extended: true }));
    expect(urlencodedSpy.calledWith(sinon.match({ extended: true }))).to.be
      .true;
    urlencodedSpy.restore();
  });

  it("should use express.json middleware", () => {
    const jsonSpy = sinon.spy(express, "json");
    app.use(express.json());
    expect(jsonSpy.calledOnce).to.be.true;
    jsonSpy.restore();
  });

  it("should initialize a passport", () => {
    const passportSpy = sinon.spy(passport, "initialize");
    app.use(passport.initialize());
    expect(passportSpy.calledOnce).to.be.true;
    passportSpy.restore();
  });

  it("should initialize a passport session", () => {
    const passportSpy = sinon.spy(passport, "session");
    app.use(passport.session());
    expect(passportSpy.calledOnce).to.be.true;
    passportSpy.restore();
  });
});

// describe('Server', async () => {
//   it('is live', async () => {
//     const res = await chai.request(server).post('/api');
//     expect(res).to.have.status(200);
//     expect(res.body).to.have.property('message', 'Server running')
//   });
// })
