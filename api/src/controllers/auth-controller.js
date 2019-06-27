'use strict';

var { log } = require('../config/dependencies');
var { AuthService, UserService } = require('../services');

var AuthController = {};
AuthController.name = 'AuthController';

AuthController.login = async(req, res, next) => {
  try {
    var auth = await AuthService.login(
      req.user,
      req.body
    );
    res.json(auth);
  } catch (err) {
    if (err.name === 'InvalidCredentials') {
      log.info('Invalid login information.');
      return res.status(400).send({
        status: 'error',
        type: 'invalidCredentials',
      });
    }
    next(err);
  }
};

AuthController.logout = async(req, res, next) => {
  try {
    await AuthService.destroyByToken(req.headers['x-auth']);
    var user = req.user;
    UserService.update(user.id, {firebaseToken: null});
    log.info('User successfully logged out.');
    res.send();
  } catch (err) {
    next(err);
  }
};

module.exports = AuthController;
