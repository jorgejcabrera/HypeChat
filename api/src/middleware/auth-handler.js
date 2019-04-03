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

module.exports = AuthHandler;
