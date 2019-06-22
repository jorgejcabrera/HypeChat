'use strict';

var {
  WorkspaceController,
  GroupController,
  ForbiddenWordController,
} = require('../controllers');
var { AuthHandler } = require('../middleware');

module.exports = (app) => {

  app.route('/workspaces/:workspaceId/groups/:groupId/users')
    .get(
      AuthHandler.authorizeWorkspace(['CREATOR', 'MODERATOR', 'MEMBER']),
      GroupController.retrieveUsers
    )
    .post(
      AuthHandler.authorizeWorkspace(['CREATOR', 'MODERATOR', 'MEMBER']),
      GroupController.addUser
    );

  app.route('/workspaces/:workspaceId/groups/:groupId')
    .get(
      AuthHandler.authorizeWorkspace(['CREATOR', 'MODERATOR', 'MEMBER']),
      GroupController.retrieve
    )
    .put(
      AuthHandler.authorizeWorkspace(['CREATOR']),
      GroupController.update
    )
    .delete(
      AuthHandler.authorizeWorkspace(['CREATOR']),
      GroupController.delete
    );

  app.route('/workspaces/:workspaceId/groups')
    .get(
      AuthHandler.authorizeWorkspace(['CREATOR', 'MODERATOR', 'MEMBER']),
      GroupController.list
    )
    .post(
      AuthHandler.authorizeWorkspace(['CREATOR', 'MODERATOR', 'MEMBER']),
      GroupController.create
    );

  app.route('/workspaces/:workspaceId/forbidden_word')
    .post(ForbiddenWordController.create)
    .get(ForbiddenWordController.listAllByWorkspace)
    .delete(ForbiddenWordController.deleteAll);

  app.route('/workspaces/:workspaceId/forbidden_word/:wordId')
    .delete(ForbiddenWordController.delete);

  app.route('/workspaces/:workspaceId/users/:userId')
    .put(
      AuthHandler.authorizeWorkspace(['CREATOR']),
      WorkspaceController.updateUserRole
    )
    .delete(
      AuthHandler.authorizeWorkspace(['CREATOR', 'MODERATOR']),
      WorkspaceController.removeUser
    );

  app.route('/workspaces/:workspaceId/users')
    .get(
      AuthHandler.authorizeWorkspace(['CREATOR', 'MODERATOR', 'MEMBER']),
      WorkspaceController.retrieveUsers
    )
    .post(
      AuthHandler.authorizeWorkspace(['CREATOR', 'MODERATOR']),
      WorkspaceController.addUser
    );

  app.route('/workspaces/:workspaceId/invite')
    .post(
      AuthHandler.authorizeWorkspace(['CREATOR', 'MODERATOR']),
      WorkspaceController.inviteUser
    );

  app.route('/workspaces/:workspaceId/messages')
    .post(
      AuthHandler.authorizeWorkspace(['CREATOR', 'MODERATOR', 'MEMBER']),
      WorkspaceController.sendMessage
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
    .get(
      AuthHandler.authorize({ requireAdmin: true }),
      WorkspaceController.listAll
    )
    .post(
      AuthHandler.authorize(),
      WorkspaceController.create
    );

  app.route('/workspaces/accept-invite')
    .post(
      AuthHandler.authorize(),
      WorkspaceController.addUserWithInvite
    );
};
