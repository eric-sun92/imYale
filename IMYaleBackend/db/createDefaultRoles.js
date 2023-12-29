/**
 * Script to create default roles in the database.
 * 
 * @module createDefaultRoles
 * @requires mongoose
 * @requires module:models/Roles
 * @requires module:config
 * @requires connect
 * 
 * @description
 * This script iterates through a predefined list of roles, each with specific permissions,
 * and adds them to the database. It checks if a role already exists before creating it
 * to avoid duplicates. This setup is crucial for managing access control in the application.
 * 
 * @example
 * // Run this script to create default roles
 * node path/to/this/file.js
 */

require('module-alias/register')
const Role = require("@models/Roles");
const mongoose = require("mongoose");
const connectDB = require("./connect");
const config = require("@config");

// Roles:
// Permission name syntax: "imyale.<resource>.<action>"
// Resource: "user", "game", "home", etc
// Action: "create", "read", "update", "delete", etc
// Scope Syntax: "[property1=value1,property2=value2,...]"
// Scope: "user_id=1234", "user_id=$user", "user_id=$user;game_id=1234", etc
// Multiple scopes are separated by a semicolon
// pass in objects with the following structure:



const rolesToCreate = [
    {
        roleName: "admin",
        permissions: {
            allow: [
                {
                    names: ["imyale.*"],
                    scopes: ["*"],
                }
            ],
            deny: [],
        }
    },
    {
        roleName: "default",
        permissions: {
            allow: [
                {
                    names: ["imyale.home.read"],
                    scopes: ["*"],
                }
            ],
            deny: [],
        }
    },
    {
        roleName: "user",
        permissions: {
            allow: [
                {
                    names: ["imyale.user.read"],
                    scopes: ["username=$username"],
                },
            ],
            deny: [], // TODO: add permissions
        }
    },
    {
        roleName: "unverified",
        permissions: {
            allow: [
                {
                    names: ["imyale.user.create"],
                    scopes: ["*"],
                },
                {
                    names: ["imyale.user.login"],
                    scopes: ["$user"],
                },
                {
                    names: ["imyale.user.verify"],
                    scopes: ["*"],
                },
            ],
            deny: [
            ],
        }
    }
]

const createDefaultRoles = async () => {
    for (const role of rolesToCreate) {
        const roleExists = await Role.findOne({ roleName: role.roleName });
        if (roleExists) {
            console.log(`Role ${role.roleName} already exists`);
        } else {
            const newRole = new Role(role);
            await newRole.save();
            console.log(`Role ${role.roleName} created`);
        }
    }
}

const url = config.mongodb.connection;
connectDB(url).then(async () => {
    await createDefaultRoles();
    mongoose.connection.close();
});
