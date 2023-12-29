/**
 * Script to create an admin user in the database.
 * 
 * @module createAdminUser
 * @requires mongoose
 * @requires module:models/Users/LocalUser
 * @requires module:config
 * @requires connect
 * 
 * @description
 * This script checks if an admin user already exists in the database.
 * If not, it creates a new admin user with predefined credentials.
 * Ensure to change the credentials in a production environment for security.
 * 
 * @example
 * // Run this script to create an admin user
 * node path/to/this/file.js
 */

require('module-alias/register')
const User = require('@models/Users/LocalUser');
const mongoose = require("mongoose");
const connectDB = require("./connect");
const config = require("@config");

const createAdminUser = async () => {
    const adminUser = {
        username: "imyale-admin",
        email: "test@yale.edu",
        password: "password",
        roles: ["admin"],
    };
    const adminUserExists = await User.findOne({ email: adminUser.email });
    if (adminUserExists) {
        console.log("Admin user already exists");
    } else {
        const user = new User(adminUser);
        await user.save();
        console.log("Admin user created");
    }
}

const url = config.mongodb.connection;
connectDB(url).then(async () => {
    await createAdminUser();
    mongoose.connection.close();
});

