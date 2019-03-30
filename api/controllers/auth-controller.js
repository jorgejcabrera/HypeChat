'use strict';

var { Auth, User } = require('../models');
var { AuthService } = require('../services');
var { EmailUtils } = require('../utils');
var { bcrypt } = require('../config/dependencies');
var AuthController = {};
AuthController.name = 'AuthController';

AuthController.login = (req, res) => {
  var email = EmailUtils.normalize(req.body.email);
  User.findOne({ where: {email} })
    .then(user => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, function(err, eq) {
          if (eq) {
            Auth.destroy(({ where: {email} }));
            Auth.create(AuthService.create(email))
              .then((auth) => res.json(auth.accessToken));
          } else {
            res.status(403).send('Access denied.');
          }
        });
      } else {
        res.status(404).send('User not found.');
      }
    });
};

// TODO create access token index
AuthController.logout = (req, res) => {
  var accessToken = req.body.accessToken;
  Auth.findOne({ where: {accessToken} })
    .then(auth => {
      if (auth) {
        var email = auth.email;
        Auth.destroy(({ where: {accessToken} }));
        res.status(200).send(email + ' logout');
      } else {
        res.status(404).send('User not found.');
      }
    });
};

module.exports = AuthController;
