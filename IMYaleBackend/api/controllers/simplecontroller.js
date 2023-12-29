// Import our config file
const config = require("@config");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const LocalUser = require("@models/Users/LocalUser");
const SES = require("@aws-sdk/client-ses");
const Profile = require("@models/Profile");
const passport = require("passport");
const yalies = require("yalies");
const yalies_api = new yalies.API(config.yaliesAPIKey);
const roles = require("@controllers/authentication/roles");
const {
  PermissionError,
  ValidationError,
  AuthorizationError,
} = require("@controllers/errors/errors");

// Import some other libraries/SDKs we'll need for this file as well
const {
  DynamoDBClient,
  ListTablesCommand,
} = require("@aws-sdk/client-dynamodb");

exports.helloworld = function (request, result) {
  result.json(config.name);
};

exports.send_simple_information = async function (request, result, next) {
  // build a scope object with some parameters to request
  const requestedScope = roles.dictToScope({
    username: request.session.user.user,
  });
  // if successful, it will return a user object. Otherwise, it will return false
  const user = await roles.checkPermission(
    request.session.user.user,
    "imyale.admin.read",
    requestedScope
  );
  if (!user)
    return next(new PermissionError("Not allowed to get user information"));

  var object = {
    name: "John",
  };
  result.json(object);
};

exports.test_api = async function (request, result) {
  var allowed = await roles.checkPermission("admin", "imyale.game.create");
  result.json({ allowed: allowed });
};
