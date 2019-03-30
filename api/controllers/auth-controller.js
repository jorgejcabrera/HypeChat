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
    var eq = await bcrypt.compare(req.body.password, user.password);
    if (eq) {
      Auth.destroy(({ where: {email} }));
      var auth = await Auth.create(AuthService.create(user.id));
      res.json(auth);
    } else {
      res.status(403).send('Access denied.');
    }
  } else {
    res.status(404).send('User not found.');
  }
};

AuthController.logout = async(req, res) => {
  var accessToken = req.body.accessToken;
  var auth = await Auth.findOne({ where: {accessToken} });

  if (auth) {
    Auth.destroy(({ where: {accessToken} }));
    res.status(200).send(auth.userId + ' logout');
  } else {
    res.status(404).send('User not found.');
  }
};

module.exports = AuthController;
