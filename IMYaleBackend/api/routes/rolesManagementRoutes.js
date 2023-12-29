const rolesManagementController = require("@controllers//rolesManagementController");

module.exports = function (app) {
  app
    .route("/api/roles")
    .get(rolesManagementController.getRoles)
    .post(rolesManagementController.createRole);

  app
    .route("/api/roles/:id")
    .get(rolesManagementController.getRole)
    .put(rolesManagementController.updateRole)
    .delete(rolesManagementController.deleteRole);

  app
    .route("/api/users/:userid/roles")
    .get(rolesManagementController.getRolesForUser)
    .post(rolesManagementController.addRoleToUser)
    .delete(rolesManagementController.removeRoleFromUser);
};
