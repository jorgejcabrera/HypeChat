'use strict';

var { UserService, AuthService } = require('../services');

var AuthController = {};
AuthController.name = 'AuthController';

AuthController.login = async(req, res, next) => {
  var user = await UserService
    .getByEmail(req.body.email)
    .catch((err) => next(err));
  if (user) {
    var valid = await AuthService
      .authenticate(user, req.body.password)
      .catch((err) => next(err));
    if (valid) {
      await AuthService
        .destroyByUser(user.id)
        .catch((err) => next(err));
      var auth = await AuthService
        .create(user.id)
        .catch((err) => next(err));
      return res.json(auth);
    }
  }
  res.status(400).send({ status: 'error', type: 'invalidCredentials' });
};

AuthController.logout = async(req, res, next) => {
  var accessToken = req.headers['x-auth'];
  await AuthService
    .destroyByToken(accessToken)
    .catch((err) => next(err));
  res.status(200).send();
};

module.exports = AuthController;
