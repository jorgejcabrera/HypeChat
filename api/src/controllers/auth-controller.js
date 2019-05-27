'use strict';

var { AuthService, UserService } = require('../services');

var AuthController = {};
AuthController.name = 'AuthController';

AuthController.login = async(req, res, next) => {
  // TODO: Check that we have the required fields.
  try {
    var auth = await AuthService.login(req.body.email, req.body.password, req.body.firebaseToken);
    res.json(auth);
  } catch (err) {
    if (err.name === 'InvalidCredentials') {
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
    UserService.udpate(user.id, {firebaseToken:''});
    res.send();
  } catch (err) {
    next(err);
  }
};

module.exports = AuthController;
