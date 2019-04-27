'use strict';

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
    }
  }

  next();
};

// For now, we just check if the user is logged in.
AuthHandler.authorize = () => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        type: 'unauthorized',
      });
    }

    // authorization successful
    next();
  };
};

AuthHandler.authorizeWorkspace = (roles) => {
  return async(req, res, next) => {
    if (!req.user) {
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

    if (!workspaceUser || !roles.includes(workspaceUser.role)) {
      return res.status(401).json({
        status: 'error',
        type: 'unauthorized',
      });
    }

    // authorization successful
    next();
  };
};

module.exports = AuthHandler;
