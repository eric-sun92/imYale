/**
 * Mongoose discriminator model for CASUser.
 * Extends the BaseUser model with specific fields for CAS authentication.
 * 
 * @module CASUser
 * @requires mongoose
 * @requires BaseUser
 * 
 * @description
 * This model represents a user authenticated through the CAS system.
 * It includes all fields from the BaseUser model and adds the 'netid' field 
 * specific to CAS authenticated users. The 'netid' is a unique identifier 
 * provided by the CAS authentication system.
 * 
 * @typedef {Object} CASUser
 * @property {String} netid - Unique NetID for the CAS authenticated user.
 */
const mongoose = require("mongoose");
const BaseUser = require("./BaseUser");

module.exports = BaseUser.discriminator(
    "CASUser",
    new mongoose.Schema({
        netid: {
            type: String,
            required: [true, "Please provide netid"],
        }
    })
);

