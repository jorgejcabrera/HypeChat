'use strict';

var { log } = require('../config/dependencies');
var { Auth, User, WorkspaceUsers } = require('../models');

var AuthHandler = {};

AuthHandler.name = 'AuthHandler';

AuthHandler.authenticate = async(req, res, next) => {
  var accessToken = req.headers['x-auth'];
  if (accessToken) {
    var auth = await Auth.findOne({
      where: { accessToken },
      include: [
        { model: User, as: 'user' },
      ],
    });
    if (auth) {
      req.user = auth.user.toJSON();
      log.info('Authentication successful!');
      log.info('Request made by user: ' + req.user.email);
      if (req.user.isAdmin) {
        log.info('User has admin privileges.');
      }
    } else {
      log.info('Request with invalid "X-Auth" header.');
    }
  } else {
    log.info('Unauthenticated request.');
  }

  next();
};

AuthHandler.authorize = (options = {}) => {
  return (req, res, next) => {
    var unauthorized = false;
    if (!req.user) {
      unauthorized = true;
      log.info(
        'Unauthorized: endpoint accessible only by authenticated users.'
      );
    } else if (options.requireAdmin && !req.user.isAdmin) {
      unauthorized = true;
      log.info('Unauthorized: endpoint accessible only by admins.');
    }

    if (unauthorized) {
      return res.status(401).json({
        status: 'error',
        type: 'unauthorized',
      });
    }

    // authorization successful
    log.info('Authorization successful!');
    next();
  };
};

AuthHandler.authorizeWorkspace = (roles) => {
  return async(req, res, next) => {
    if (!req.user) {
      log.info(
        'Unauthorized: endpoint accessible only by authenticated users.'
      );
      return res.status(401).json({
        status: 'error',
        type: 'unauthorized',
      });
    } else if (req.user.isAdmin) {
      return next();
    }

    var workspaceUser = await WorkspaceUsers.findOne({
      where: {
        userId: req.user.id,
        workspaceId: req.params.workspaceId,
      },
    });

    var unauthorized = false;
    if (!workspaceUser) {
      unauthorized = true;
      log.info('Unauthorized: user doesn\'t belong to workspace.');
    } else if (!roles.includes(workspaceUser.role)) {
      unauthorized = true;
      log.info(
        'Unauthorized: user doesn\'t have the required privileges. ' +
        'User role: ' + workspaceUser.role + '. Required roles: ' + roles
      );
    }

    if (unauthorized) {
      return res.status(401).json({
        status: 'error',
        type: 'unauthorized',
      });
    }

    req.user.workspaceRole = workspaceUser.role;

    log.info('Workspace authorization successful!');
    next();
  };
};

module.exports = AuthHandler;
