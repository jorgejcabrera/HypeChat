'use strict';

var { UserController, WorkspaceController } = require('../controllers');

module.exports = (app) => {
  app.route('/users/:userId/workspaces')
    .get(WorkspaceController.retrieveWorkspacesByUser);

  app.route('/users/:userId/profile')
    .get(UserController.getProfile);

  app.route('/users/:userId/password')
    .put(UserController.updatePassword);

  app.route('/users/:userId')
    .get(UserController.retrieve)
    .put(UserController.update)
    .delete(UserController.delete);

  app.route('/recoveryPassword')
    .put(UserController.recoveryPassword);
};
