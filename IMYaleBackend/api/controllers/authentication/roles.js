const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const Roles = require('@models/Roles');
const BaseUser = require('@models/Users/BaseUser');

// Roles:
// Permission name syntax: "imyale.<resource>.<action>"
// Resource: "user", "game", "home", etc
// Action: "create", "read", "update", "delete", etc
// Scope Syntax: "[property1=value1,property2=value2,...]"
// Scope: "user_id=1234", "user_id=$user", "user_id=$user;game_id=1234", etc
// Multiple scopes are separated by a semicolon
// pass in objects with the following structure:


/**
 * Checks if a specific permission matches with the requested permission.
 * Supports wildcard '*' in the defined permission.
 * 
 * @param {string} defined_specific_permission_name - The specific permission name defined in a role.
 * @param {string} requested_permission_name - The permission name being requested.
 * @returns {boolean} True if there is a match, false otherwise.
 */

function checkSpecificPermissionMatch(defined_specific_permission_name, requested_permission_name) {
    // support for wildcards
    // role_permission is in the form of "permission.subpermission.action", any of which can be a wildcard
    if (defined_specific_permission_name === "*") return true;
    var defined_permission_split = defined_specific_permission_name.split(".");
    var user_permission_split = requested_permission_name.split(".");
    for (var i = 0; i < defined_permission_split.length; i++) {
        if (defined_permission_split[i] !== "*" && defined_permission_split[i] !== user_permission_split[i]) return false;
    }
    return true;
}

/**
 * Checks if any defined permissions match with the requested permission.
 * Supports wildcards in the defined permissions.
 * 
 * @param {string[]} defined_permission_names - Array of defined permission names in a role.
 * @param {string} requested_permission_name - The permission name being requested.
 * @returns {boolean} True if any permission matches, false otherwise.
 */
function checkAnyPermissionMatch(defined_permission_names, requested_permission_name) {
    // support for wildcards
    // defined_permission_names = ["imyale.*", "imyale.user.*", "imyale.user.create"] (etc)
    // role_permission is in the form of "permission.subpermission.action", any of which can be a wildcard
    if (defined_permission_names.includes("*")) return true;
    for (var i = 0; i < defined_permission_names.length; i++) {
        if (checkSpecificPermissionMatch(defined_permission_names[i], requested_permission_name)) return true;
    }
    return false;
}


/**
 * Checks if a specific scope matches with the requested scope.
 * Supports wildcard '*' in the defined scope.
 * 
 * @param {string} defined_scope - The defined scope in a role permission.
 * @param {string} requested_scope - The requested scope to check against.
 * @param {Object} [scope_parameters] - Optional parameters for the scope.
 * @returns {boolean} True if the scope matches, false otherwise.
 */
function checkSpecificScopeMatch(defined_scope, requested_scope, scope_parameters) {
    // support for wildcards
    // defined_scope is in the form of "user_id=$user", "user_id=1234", etc
    // requested_scope is in the form of "user_id=1234", etc
    // scope_parameters is in the form of {user: "1234", game: "5678", ...}
    // scope_parameters is optional
    if (!scope_parameters) scope_parameters = {};
    if (defined_scope === "*") return true;
    var defined_scope_splits = defined_scope.split(";");
    var defined_scope_dict = {};
    defined_scope_splits.forEach((defined_scope_split, index) => {
        var defined_scope_split_splits = defined_scope_split.split("=");
        if (defined_scope_split_splits.length !== 2) {
            console.warn("Warning: invalid scope \"" + defined_scope_split+"\"");
            return false;
        }

        var defined_scope_split_name = defined_scope_split_splits[0];

        var defined_scope_split_values = defined_scope_split_splits[1].split(",");
        // for each defined scope value, hydrate it if it's a variable
        defined_scope_split_values.forEach((defined_scope_split_value, index) => {
            if (defined_scope_split_value[0] === "$") {
                defined_scope_split_values[index] = scope_parameters[defined_scope_split_value.slice(1)];
            }
        });
        defined_scope_dict[defined_scope_split_name] = defined_scope_split_values;
    });
    var requested_scope_splits = requested_scope.split(";");
    var requested_scope_dict = {};
    requested_scope_splits.forEach((requested_scope_split, index) => {
        var requested_scope_split_splits = requested_scope_split.split("=");
        var requested_scope_split_name = requested_scope_split_splits[0];
        requested_scope_dict[requested_scope_split_name] = requested_scope_split_splits[1];
    });
    // check if all of the defined scopes are satisfied by the requested scope
    for (var defined_scope_key in defined_scope_dict) {
        if (!(defined_scope_key in requested_scope_dict)) return false;
        // support wildcards
        // a single wildcard "*" can be used to match any value, so like *value, va*lue, value* would all match to something)
        var defined_scope_values = defined_scope_dict[defined_scope_key];
        var requested_scope_value = requested_scope_dict[defined_scope_key];
        // process wildcards here

        if (defined_scope_values.includes("*")) continue;

        //match with wildcard
        var matched=false;
        for (var i = 0; i < defined_scope_values.length; i++) {
            var defined_scope_value = defined_scope_values[i];
            if (defined_scope_value.includes("*")) {
                var regex = new RegExp(defined_scope_value.replace("*", ".*"));
                // regex should match, but should be no remaining characters
                if (regex.test(requested_scope_value) && regex.exec(requested_scope_value)[0].length === requested_scope_value.length) {
                    matched=true;
                    break;
                }
            } else {
                // console.log(defined_scope_value, requested_scope_value)
                if (defined_scope_value === requested_scope_value) {
                    matched=true;
                    break;
                }
            }
        }
        // console.log(matched, defined_scope_key, defined_scope_values, requested_scope_value)
        if (!matched) return false;
    }
    return true;
}

/**
 * Checks if any of the defined scopes match with the requested scope.
 * Supports wildcards in the defined scopes.
 * 
 * @param {string[]} defined_scopes - Array of defined scopes in a role permission.
 * @param {string} requested_scope - The requested scope to check against.
 * @param {Object} [scope_parameters] - Optional parameters for the scope.
 * @returns {boolean} True if any scope matches, false otherwise.
 */
function checkAnyScopeMatch(defined_scopes, requested_scope, scope_parameters) {
    // support for wildcards
    // defined_scopes is in the form of ["user_id=$user", "user_id=1234", etc]
    // requested_scope is in the form of "user_id=1234", etc
    // scope_parameters is in the form of {user: "1234", game: "5678", ...}
    // scope_parameters is optional
    if (!scope_parameters) scope_parameters = {};
    if (defined_scopes.includes("*")) return true;
    for (var i = 0; i < defined_scopes.length; i++) {
        if (checkSpecificScopeMatch(defined_scopes[i], requested_scope, scope_parameters)) return true;
    }
    return false;
}

/**
 * Checks if a permission and scope match with those defined in a permission object.
 * 
 * @param {Object} defined_permission_object - Permission object with names and scopes.
 * @param {string} requested_permission - The permission being requested.
 * @param {string} requested_scope - The scope being requested.
 * @param {Object} [scope_parameters] - Optional parameters for the scope.
 * @returns {boolean} True if both permission and scope match, false otherwise.
 */
function checkMatch(defined_permission_object, requested_permission, requested_scope, scope_parameters) {
    // defined_permission_object is in the form of {name: ["imyale.user.read"], scopes: ["user_id=$user"]}
    // requested_permission is in the form of "imyale.user.read"
    // scope_parameters is in the form of {user: "1234", game: "5678", ...}
    // scope_parameters is optional
    // console.log(defined_permission_object, requested_permission, requested_scope, scope_parameters);
    if (!scope_parameters) scope_parameters = {};
    if (!checkAnyPermissionMatch(defined_permission_object.names, requested_permission)) return false;
    if (!checkAnyScopeMatch(defined_permission_object.scopes, requested_scope, scope_parameters)) return false;
    return true;
}

/**
 * Checks if a user has a specific permission and scope.
 * 
 * @param {string} username - Username of the user to check permissions for.
 * @param {string} requested_permission - The permission being requested.
 * @param {string} requested_scope - The scope being requested.
 * @param {Object} [scope_parameters] - Optional parameters for the scope.
 * @returns {Promise<Object|false>} The user object if permission is granted, false otherwise.
 */
exports.checkPermission = async function (username, requested_permission, requested_scope, scope_parameters) {
    // username is the username of the user to check permissions for
    // check if the user is explicitly denied the permission first
    var user_obj = await BaseUser.findOne({ username: username });
    if (!user_obj) return false;

    if (scope_parameters) {
        if (scope_parameters.username) console.warn("Warning: scope_parameters.username is overridden");
        if (scope_parameters.roles) console.warn("Warning: scope_parameters.roles is overridden");
        if (scope_parameters.email) console.warn("Warning: scope_parameters.email is overridden");
        if (scope_parameters.verified) console.warn("Warning: scope_parameters.verified is overridden");
    }
    scope_parameters = scope_parameters || {};
    scope_parameters.username = user_obj.username;
    // scope_parameters.roles= user_obj.roles;
    scope_parameters.email = user_obj.email;
    scope_parameters.verified = user_obj.verified? "true": "false";

    // run all of the roles in parallel
    var roles = await Roles.find({ roleName: { $in: user_obj.roles } });
    if (!roles) return false;
    // if any of the roles don't exist, delete them from the user's roles
    if (roles.length !== user_obj.roles.length) {
        var new_roles = [];
        for (var i = 0; i < roles.length; i++) {
            new_roles.push(roles[i].roleName);
        }
        user_obj.roles = new_roles;
        await user_obj.save();
    }
    // console.log(roles);
    var promises = [];
    for (var i = 0; i < roles.length; i++) {
        var role = roles[i];
        promises.push(new Promise((resolve, reject) => {
            if (role.permissions.deny.some((defined_permission_object) =>
                checkMatch(defined_permission_object, requested_permission, requested_scope, scope_parameters))) {
                resolve(false);
            }
            if (role.permissions.allow.some((defined_permission_object) =>
                checkMatch(defined_permission_object, requested_permission, requested_scope, scope_parameters))) {
                resolve(user_obj);
            }
            resolve(false);
        }));
    }
    var results = await Promise.all(promises);

    // console.log(results);
    for (var i = 0; i < results.length; i++) {
        if (results[i]) return results[i];
    }


    // check if the user is allowed the permission by default
    // if (user_role.default.includes(permission)) return true;
    return false;
}

/**
 * Converts a scope dictionary to a scope string.
 * 
 * @param {Object} scope_dict - Dictionary representing the scope.
 * @returns {string} A string representation of the scope.
 */
exports.dictToScope = function (scope_dict) {
    // scope_dict = {user_id: "1234", game_id: "5678"}
    // returns "user_id=1234;game_id=5678"
    var scope_str = "";
    for (var key in scope_dict) {
        scope_str += key + "=" + scope_dict[key] + ";";
    }
    return scope_str;
}