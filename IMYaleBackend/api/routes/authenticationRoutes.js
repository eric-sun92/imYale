const utilfunctions = require("@utils/utilfunctions");
var authLocalController = require("@controllers/authentication/loginControllers/localAuthentication");
var authCASController = require("@controllers/authentication/loginControllers/casAuthentication");

module.exports = function (app) {
  //Not used, since we are using CAS login. Inore
  app.route("/api/auth/local/login").post(authLocalController.LocalLogin);
  app
    .route("/api/auth/local/verify/check")
    .post(authLocalController.checkUserVerified);
  app
    .route("/api/auth/local/verify/accept")
    .get(authLocalController.userVerify);
  app.route("/api/auth/local/create").post(authLocalController.createLocalUser);
  app
    .route("/api/auth/local/passwordreset/start")
    .post(authLocalController.passwordReset);
  app
    .route("/api/auth/local/passwordreset/accept")
    .post(authLocalController.confirmPasswordReset);

  //CAS Login routes
  app.route("/api/auth/cas/login").get(authCASController.CASLogin);
  app.route("/api/auth/cas/logout").get(authCASController.CASLogout);
};
