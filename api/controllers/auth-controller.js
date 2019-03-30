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
            Auth.create(AuthService.create(user.id))
              .then((auth) => res.json(auth));
          } else {
            res.status(403).send('Access denied.');
          }
        });
      } else {
        res.status(404).send('User not found.');
      }
    });
};

AuthController.logout = (req, res) => {
  var accessToken = req.body.accessToken;
  Auth.findOne({ where: {accessToken} })
    .then(auth => {
      if (auth) {
        Auth.destroy(({ where: {accessToken} }));
        res.status(200).send(auth.userId + ' logout');
      } else {
        res.status(404).send('User not found.');
      }
    });
};

// TODO this method sould be use by the middleware
AuthController.checkToken = (req, res, next) => {
  var accessToken = req.headers['X-Auth'];

  if (typeof accessToken !== 'undefined') {
    Auth.findOne({ where: {accessToken} })
      .then(auth => {
        if (auth) {
          req.body.email = auth.email;
        } else {
          res.status(404).send('User not found.');
        }
      });
    next();
  } else {
    res.sendStatus(403);
  }
};
module.exports = AuthController;
