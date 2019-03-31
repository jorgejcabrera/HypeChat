'use strict';

var { UserService, AuthService } = require('../services');

var AuthController = {};
AuthController.name = 'AuthController';

AuthController.login = async(req, res) => {
  var user = await UserService.getByEmail(req.body.email);
  if (user) {
    var valid = await AuthService.authenticate(user, req.body.password);
    if (valid) {
      await AuthService.destroyByUser(user.id);
      var auth = await AuthService.create(user.id);
      return res.json(auth);
    }
  }
  res.status(400).send('Invalid user or password.');
};

AuthController.logout = async(req, res) => {
  var accessToken = req.headers['x-auth'];
  await AuthService.destroyByToken(accessToken);
  res.status(200).send();
};

module.exports = AuthController;
