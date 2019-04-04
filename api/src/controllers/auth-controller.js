'use strict';

var { AuthService } = require('../services');

var AuthController = {};
AuthController.name = 'AuthController';

AuthController.login = async(req, res, next) => {
  // TODO: Check that we have the required fields.
  var auth = await AuthService
    .login(req.body.email, req.body.password)
    .catch((err) => {
      if (err.message === 'InvalidCredentials') {
        res.status(400).send({
          status: 'error',
          type: 'invalidCredentials',
        });
        return;
      }
      console.log(err);
      next(err);
    });
  auth && res.json(auth);
};

AuthController.logout = async(req, res, next) => {
  var accessToken = req.headers['x-auth'];
  await AuthService
    .destroyByToken(accessToken)
    .catch((err) => next(err));
  res.status(200).send();
};

module.exports = AuthController;
