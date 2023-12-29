const Roles = require("@models/Roles");
const BaseUser = require("@models/Users/BaseUser");
const { StatusCodes } = require("http-status-codes");
const {
  PermissionError,
  ValidationError,
  AuthorizationError,
} = require("@controllers/errors/errors");
const {
  dictToScope,
  checkPermission,
} = require("@controllers/authentication/roles");

/**
 * Validates a role block
 * @param roleBlock the role block to validate (a {names: [], scopes: [], description: ""} object)
 * @returns null if the role block is valid, a string with an error message if the role block is invalid
 */
function validateRoleBlock(roleBlock) {
  // roleBlock is a {names: [], scopes: [], description: ""} object
  // names, scopes is an array of strings, description is a string
  if (!roleBlock) return "Missing role block";
  if (!roleBlock.names || !roleBlock.scopes || !roleBlock.description)
    return "Missing names, scopes, or description property";
  // if there are any other properties in the role block, return false
  if (Object.keys(roleBlock).length !== 3)
    return "Should only have names, scopes, and description properties";
  if (!Array.isArray(roleBlock.names) || !Array.isArray(roleBlock.scopes))
    return "Names and scopes should be arrays";
  if (typeof roleBlock.description !== "string")
    return "Description should be a string";
  // check that all names are strings, and start with "imyale."
  for (var i = 0; i < roleBlock.names.length; i++) {
    if (typeof roleBlock.names[i] !== "string")
      return "Names should be strings";
    if (!roleBlock.names[i].startsWith("imyale."))
      return "Names should start with imyale.";
  }
  // check that all scopes are strings
  for (var i = 0; i < roleBlock.scopes.length; i++) {
    if (typeof roleBlock.scopes[i] !== "string")
      return "Scopes should be strings";
  }
  return null;
}

function validatePermissionsSection(permissionsSection) {
  // permissionsSection is an object with an allow and deny property
  // allow and deny are arrays of role blocks
  if (!permissionsSection) return "Missing permissions section";
  if (!permissionsSection.allow && !permissionsSection.deny)
    return "Missing allow or deny property";
  if (permissionsSection.allow && !Array.isArray(permissionsSection.allow))
    return "Allow should be an array";
  if (permissionsSection.deny && !Array.isArray(permissionsSection.deny))
    return "Deny should be an array";
  if (permissionsSection.allow) {
    for (const roleBlock of permissionsSection.allow) {
      const error = validateRoleBlock(roleBlock);
      if (error) return error;
    }
  }
  if (permissionsSection.deny) {
    for (const roleBlock of permissionsSection.deny) {
      const error = validateRoleBlock(roleBlock);
      if (error) return error;
    }
  }
  return null;
}

async function removeRoleFromUsers(roleName) {
  const users = await BaseUser.find({ roles: roleName });
  for (const user of users) {
    user.roles = user.roles.filter((role) => role !== roleName);
    await user.save();
  }
}

/*
    POST /api/roles
    Creates a new role

    Send a JSON object in the body with the following structure:
    {
        "roleName": "role name",
        "permissions": {
            "allow": [
                {
                    "names": ["imyale.<service>.<action>", "imyale.<service>.<action>", ...],
                    "scopes": ["user_id=$user", "user_id=1234", ...],
                    "description": "An optional description of this permission"
                }
            ],
            "deny": [
                {
                    "names": ["imyale.<service>.<action>", "imyale.<service>.<action>", ...],
                    "scopes": ["user_id=$user", "user_id=1234", ...],
                    "description": "An optional description of this permission"
                }
            ]
        }
    }

@param roleName: the name of the role to create
@param permissions: the permissions of the role to create


 */

exports.createRole = async function (req, res, next) {
  if (!req.session?.user?.user)
    return next(new AuthorizationError("Not logged in"));

  const requestedScope = dictToScope({
    username: req.session.user.user,
    role: req.session.user.role,
  });

  const user = await checkPermission(
    req.session.user.user,
    "imyale.role.create",
    requestedScope
  );
  if (!user) return next(new PermissionError("Not allowed to create roles"));

  // Check that the request body is valid
  const { roleName, permissions } = req.body;
  if (!roleName || !permissions) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing roleName or permissions" });
  }

  // Check that the role doesn't already exist
  var exists = await Roles.exists({ roleName });
  if (exists) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Role already exists" });
  }

  // Validate the permissions
  const error = validatePermissionsSection(permissions);
  if (error)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  // Create the role
  const role = await Roles.create({ roleName, permissions });

  return res
    .status(StatusCodes.CREATED)
    .json({ message: "Role created successfully", role });
};

/**
 * Updates a role. The role must already exist, and the user must have permission to update the role.
 * Furthermore, this is just an update, any permissions that are not specified in the request body will not be changed.
 * @param roleName the name of the role to update
 * @param permissions the new permissions of the role
 * @returns the updated role
 * @throws a ValidationError if the role doesn't exist
 * @throws a PermissionError if the user doesn't have permission to update the role\
 * @throws a ValidationError if any data is invalid
 *
 */

exports.updateRole = async function (req, res, next) {
  if (!req.session?.user?.user)
    return next(new AuthorizationError("Not logged in"));

  const requestedScope = dictToScope({
    username: req.session.user.user,
    role: req.session.user.role,
  });

  const user = await checkPermission(
    req.session.user.user,
    "imyale.role.update",
    requestedScope
  );
  if (!user) return next(new PermissionError("Not allowed to update roles"));

  const roleName = req.params.id;
  // Check that the request body is valid
  const { permissions } = req.body;
  if (!roleName || !permissions) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing roleName or permissions" });
  }

  // Check that the role exists
  var role = await Roles.findOne({ roleName });
  if (!role) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Role does not exist" });
  }

  // Validate the permissions
  const error = validatePermissionsSection(permissions);
  if (error)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });

  // Update the role
  role.permissions = permissions;
  await role.save();

  return res
    .status(StatusCodes.OK)
    .json({ message: "Role updated successfully", role });
};

/**
 * Deletes a role. The role must already exist, and the user must have permission to delete the role.
 * @param roleName the name of the role to delete
 * @returns the deleted role
 */

exports.deleteRole = async function (req, res, next) {
  if (!req.session?.user?.user)
    return next(new AuthorizationError("Not logged in"));

  const requestedScope = dictToScope({
    username: req.session.user.user,
    role: req.session.user.role,
  });

  const user = await checkPermission(
    req.session.user.user,
    "imyale.role.delete",
    requestedScope
  );
  if (!user) return next(new PermissionError("Not allowed to delete roles"));

  // Check that the request body is valid
  const roleName = req.params.id;
  if (!roleName) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing roleName" });
  }

  // Check that the role exists
  var role = await Roles.findOneAndDelete({ roleName });
  if (!role) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Role does not exist" });
  }

  // start a background async process to remove the role from all users
  removeRoleFromUsers(roleName);

  return res
    .status(StatusCodes.OK)
    .json({ message: "Role deleted successfully" });
};

/**
 * Gets a list of all roles
 * @param username (optional) the username of the user to get the roles for. If not specified, returns all roles
 * @returns a list of all roles
 * @throws a PermissionError if the user doesn't have permission to list roles
 */

exports.getRoles = async function (req, res, next) {
  if (!req.session?.user?.user)
    return next(new AuthorizationError("Not logged in"));

  const requestedScope = dictToScope({
    username: req.session.user.user,
    role: req.session.user.role,
  });

  const user = await checkPermission(
    req.session.user.user,
    "imyale.role.list",
    requestedScope
  );
  if (!user) return next(new PermissionError("Not allowed to list roles"));

  // Check that the request body is valid
  const { username } = req.body;
  if (username && typeof username !== "string") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Username should be a string" });
  }

  if (username === undefined) {
    // Get all roles
    const roles = await Roles.find({});
    return res.status(StatusCodes.OK).json({ roles });
  } else if (username === req.session.user.user) {
    // Get all roles for the current user (in the user object)
    const roles = await Roles.find({ roleName: { $in: user.roles } });
    return res.status(StatusCodes.OK).json({ roles });
  } else {
    const selected_user = BaseUser.findOne({ username: username });
    if (!selected_user) return next(new ValidationError("User does not exist"));
    const roles = await Roles.find({ roleName: { $in: selected_user.roles } });
    return res.status(StatusCodes.OK).json({ roles });
  }
};

/**
 * Gets a role by name
 * @param roleName the name of the role to get
 * @returns the role
 */

exports.getRole = async function (req, res, next) {
  if (!req.session?.user?.user)
    return next(new AuthorizationError("Not logged in"));

  const requestedScope = dictToScope({
    username: req.session.user.user,
    role: req.session.user.role,
  });

  const user = await checkPermission(
    req.session.user.user,
    "imyale.role.get",
    requestedScope
  );
  if (!user) return next(new PermissionError("Not allowed to get roles"));

  // Check that the request body is valid
  const { roleName } = req.body;
  if (!roleName) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing roleName" });
  }

  // Check that the role exists
  var role = await Roles.findOne({ roleName });
  if (!role) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Role does not exist" });
  }

  return res.status(StatusCodes.OK).json({ role });
};

/**
 * Adds a role to a user
 */

exports.addRoleToUser = async function (req, res, next) {
  if (!req.session?.user?.user)
    return next(new AuthorizationError("Not logged in"));

  const requestedScope = dictToScope({
    username: req.session.user.user,
    role: req.session.user.role,
  });

  const user = await checkPermission(
    req.session.user.user,
    "imyale.role.assign",
    requestedScope
  );
  if (!user) return next(new PermissionError("Not allowed to add roles"));

  // Check that the request body is valid
  const { roleName, username } = req.body;
  if (!roleName || !username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing roleName or username" });
  }

  // Check that the role exists
  var role = await Roles.findOne({ roleName });
  if (!role) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Role does not exist" });
  }

  // Check that the user exists
  var baseUser = await BaseUser.findOne({ username });
  if (!baseUser) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "User does not exist" });
  }

  // Check that the user doesn't already have the role
  if (baseUser.roles.includes(roleName)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "User already has this role" });
  }

  // Add the role to the user
  baseUser.roles.push(roleName);
  await baseUser.save();
  role.users.push(username);
  await role.save();

  return res
    .status(StatusCodes.OK)
    .json({ message: "Role added successfully" });
};

/**
 * Removes a role from a user
 * @param roleName the name of the role to remove
 * @param username the username of the user to remove the role from
 * @returns a message indicating success or failure
 * @throws a PermissionError if the user doesn't have permission to remove the role
 * @throws a ValidationError if the role or user doesn't exist
 * @throws a ValidationError if the user doesn't have the role
 * @throws a ValidationError if the user is removing their own role
 */

exports.removeRoleFromUser = async function (req, res, next) {
  if (!req.session?.user?.user)
    return next(new AuthorizationError("Not logged in"));

  const requestedScope = dictToScope({
    username: req.session.user.user,
    role: req.session.user.role,
  });

  const user = await checkPermission(
    req.session.user.user,
    "imyale.role.remove",
    requestedScope
  );
  if (!user) return next(new PermissionError("Not allowed to remove roles"));

  // Check that the request body is valid
  const { roleName, username } = req.body;
  if (!roleName || !username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing roleName or username" });
  }

  // Check that the role exists
  var role = await Roles.findOne({ roleName });
  if (!role) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Role does not exist" });
  }

  // Check that the user exists
  var baseUser = await BaseUser.findOne({ username });
  if (!baseUser) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "User does not exist" });
  }

  // Check that the user has the role
  if (!baseUser.roles.includes(roleName)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "User does not have this role" });
  }

  // Remove the role from the user
  baseUser.roles = baseUser.roles.filter((role) => role !== roleName);
  await baseUser.save();
  role.users = role.users.filter((user) => user !== username);
  await role.save();

  return res
    .status(StatusCodes.OK)
    .json({ message: "Role removed successfully" });
};
//
// /**
//  * Gets a list of all users with a role
//  * @param roleName the name of the role to get the users for
//  * @returns a list of all users with the role
//  * @throws a PermissionError if the user doesn't have permission to list users with the role
//  * @throws a ValidationError if the role doesn't exist
//  */
//
// exports.getUsersWithRole = async function (req, res, next) {
//     if (!req.session?.user?.username) return next(new AuthorizationError("Not logged in"));
//
//     const requestedScope = dictToScope({
//         username: req.session.user.username,
//         role: req.session.user.role,
//     });
//
//     const user = await checkPermission(req.session.user.user, "imyale.role.users.list", requestedScope);
//     if (!user) return next(new PermissionError("Not allowed to list users with roles"));
//
//     // Check that the request body is valid
//     const {roleName} = req.body;
//     if (!roleName) {
//         return res.status(StatusCodes.BAD_REQUEST).json({message: "Missing roleName"});
//     }
//
//     // Check that the role exists
//     var role = await Roles.findOne({roleName});
//     if (!role) {
//         return res.status(StatusCodes.BAD_REQUEST).json({message: "Role does not exist"});
//     }
//
//     // Get the users with the role
//     const users = await BaseUser.find({roles: roleName});
//
//     return res.status(StatusCodes.OK).json({users});
// }

/**
 * Gets a list of all roles for a user
 * @param username the username of the user to get the roles for
 * @returns a list of all roles for the user
 * @throws a PermissionError if the user doesn't have permission to list roles for the user
 */

exports.getRolesForUser = async function (req, res, next) {
  if (!req.session?.user?.user)
    return next(new AuthorizationError("Not logged in"));

  // Check that the request body is valid
  const { username } = req.body;
  if (!username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing username" });
  }

  // Check that the user exists
  var baseUser = await BaseUser.findOne({ username });
  if (!baseUser) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "User does not exist" });
  }

  // Check that the user has permission to list roles for the user
  if (req.session.user.user !== username) {
    const requestedScope = dictToScope({
      username: username,
      role: req.session.user.role,
    });

    const user = await checkPermission(
      req.session.user.user,
      "imyale.role.list",
      requestedScope
    );
    if (!user)
      return next(
        new PermissionError("Not allowed to list roles for this user")
      );
  }

  // Get the roles for the user
  const roles = await Roles.find({ roleName: { $in: baseUser.roles } });

  return res.status(StatusCodes.OK).json({ roles });
};
