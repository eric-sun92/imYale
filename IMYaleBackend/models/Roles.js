/**
 * Mongoose model for Role.
 * 
 * @module Role
 * @requires mongoose
 * 
 * @description
 * Represents a role in the database. Each role has a unique name and is associated with a set of users.
 * The permissions for each role are defined in 'allow' and 'deny' fields, specifying the actions that
 * users with this role are permitted or restricted from doing. Each permission includes names, scopes,
 * and a description.
 * 
 * @typedef {Object} Role
 * @property {String} roleName - The unique name of the role.
 * @property {mongoose.Schema.Types.ObjectId[]} users - Array of ObjectIds referencing the BaseUser model.
 * @property {Object} permissions - Object containing 'allow' and 'deny' permissions.
 * @property {Array.<{names: String[], scopes: String[], description: String}>} permissions.allow - Permissions allowed by this role.
 * @property {Array.<{names: String[], scopes: String[], description: String}>} permissions.deny - Permissions denied by this role.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'BaseUser',
    }],
    // allow/deny should have a list of permissions, each of which should have a name, and a list of scopes
    permissions: {
        allow: [{
            names: [String],
            scopes: [String],
            description: String,
        }],
        deny: [{
            names: [String],
            scopes: [String],
            description: String,
        }],
    },
});

module.exports = mongoose.model('Role', RoleSchema);