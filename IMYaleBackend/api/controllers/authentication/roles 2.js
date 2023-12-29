const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const Roles = require('@models/Roles');
const User = require('@models/Users/BaseUser');

function checkMatch(role_permission, user_permission) {
    // support for wildcards
    // role_permission is in the form of "permission.subpermission.action", any of which can be a wildcard
    if (role_permission === "*") return true;
    var role_permission_split = role_permission.split(".");
    var user_permission_split = user_permission.split(".");
    for (var i = 0; i < role_permission_split.length; i++) {
        if (role_permission_split[i] !== "*" && role_permission_split[i] !== user_permission_split[i]) return false;
    }
    return true;
}

exports.checkPermission = async function (role_name, permission) {
    // check if the user is explicitly denied the permission first
    var user_role = await Roles.findOne({ roleName: role_name });
    console.log(user_role)
    if (!user_role) return false;
    if (user_role.permissions.deny.some((role_permission) => checkMatch(role_permission, permission))) return false;
    if (user_role.permissions.allow.some((role_permission) => checkMatch(role_permission, permission))) return true;

    // check if the user is allowed the permission by default
    // if (user_role.default.includes(permission)) return true;
    return false;
}



// checkPermission(role_name, "imyale.game.create")
