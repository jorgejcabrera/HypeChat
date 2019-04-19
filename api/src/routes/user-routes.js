'use strict';

var { UserController, WorkspaceController } = require('../controllers');

module.exports = (app) => {
  app.route('/users/:userId/workspaces')
    .get(WorkspaceController.retrieveWorkspacesByUser);

  app.route('/users/:userId')
    .get(UserController.retrieve)
    .put(UserController.update)
    .delete(UserController.delete);

  app.route('/users')
    .post(UserController.create);
};
