const utilfunctions = require("@utils/utilfunctions");
const simplecontroller = require("@controllers/simplecontroller");
module.exports = function (app) {
  // Add all the routes to our APIs here
  // app.route([url]) points to a method, tell Express which method it should execute with
  // the .get, .post, .put, .delete, etc methods, and then pass in the method from the controller
  // that we want to execute. An example is shown below:

  // For now, just think of a controller as a group of API methods in the same category, or are
  // related to each other in some way.
  app.route("/api/helloworld").get(simplecontroller.helloworld);
  app.route("/api/cool").get(simplecontroller.send_simple_information);
  app.route("/api/test").get(simplecontroller.test_api);
};
