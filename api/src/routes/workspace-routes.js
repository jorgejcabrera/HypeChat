'use strict';

var { WorkspaceController } = require('../controllers');
var { AuthHandler } = require('../middleware');

module.exports = (app) => {

  app.route('/workspaces/:workspaceId/users')
    .post(WorkspaceController.addUser);

  app.route('/workspaces/:workspaceId')
    .get(WorkspaceController.retrieve)
    .put(AuthHandler.authorize(), WorkspaceController.update)
    .delete(AuthHandler.authorize(), WorkspaceController.delete);

  app.route('/workspaces')
    .post(AuthHandler.authorize(), WorkspaceController.create);
};
