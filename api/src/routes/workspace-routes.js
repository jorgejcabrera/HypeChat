'use strict';

var { WorkspaceController } = require('../controllers');
var { AuthHandler } = require('../middleware');

module.exports = (app) => {

  app.route('/workspaces/:workspaceId/users')
    .post(
      AuthHandler.authorizeWorkspace(['CREATOR', 'MODERATOR']),
      WorkspaceController.addUser
    )
    .get(
      AuthHandler.authorizeWorkspace(['CREATOR', 'MODERATOR', 'MEMBER']),
      WorkspaceController.retrieveUsers
    );

  app.route('/workspaces/:workspaceId')
    .get(
      AuthHandler.authorizeWorkspace(['CREATOR', 'MODERATOR', 'MEMBER']),
      WorkspaceController.retrieve
    )
    .put(
      AuthHandler.authorizeWorkspace(['CREATOR']),
      WorkspaceController.update
    )
    .delete(
      AuthHandler.authorizeWorkspace(['CREATOR']),
      WorkspaceController.delete
    );

  app.route('/workspaces')
    .post(AuthHandler.authorize(), WorkspaceController.create);
};
