'use strict';

var { Auth, User } = require('../models');
var { AuthService } = require('../services');
var { EmailUtils } = require('../utils');
var { bcrypt } = require('../config/dependencies');
var AuthController = {};
AuthController.name = 'AuthController';

AuthController.login = async(req, res) => {
  var email = EmailUtils.normalize(req.body.email);
  var user = await User.findOne({ where: {email} });

  if (user) {
    var userId = user.id;
    var eq = await bcrypt.compare(req.body.password, user.password);
    if (eq) {
      await Auth.destroy(({ where: {userId} }));
      var auth = await Auth.create(AuthService.create(userId));
      return res.json(auth);
    }
  }

  res.status(400).send('Invalid user or password.');
};

AuthController.logout = async(req, res) => {
  var accessToken = req.headers['x-auth'];
  var auth = await Auth.findOne({ where: {accessToken} });

  if (auth) {
    await Auth.destroy(({ where: {accessToken} }));
    res.status(200).send(auth.userId + ' logout');
  } else {
    res.status(404).send('User not found.');
  }
};

module.exports = AuthController;
