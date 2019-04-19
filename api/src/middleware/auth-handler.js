'use strict';

var { Auth, User } = require('../models');

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

module.exports = AuthHandler;
