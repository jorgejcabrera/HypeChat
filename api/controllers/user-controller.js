'use strict';

var { User, Auth } = require('../models');
var { AuthService } = require('../services');
var { EmailUtils } = require('../utils');
var { bcrypt } = require('../config/dependencies');

const saltRounds = 10;
var UserController = {};
UserController.name = 'UserController';

UserController.create = (req, res) => {
  var email = EmailUtils.normalize(req.body.email);
  User.findOne({ where: {email} })
    .then((user) => {
      if (user) {
        res.status(400).send('User already exists.');
      } else {
        bcrypt.hash(req.body.password, saltRounds, function(err, hash){
          req.body.password = hash;
          req.body.email = email;
          User.create(req.body)
            .then((user) => {
              Auth.create(AuthService.create(email));
              res.json(user);
            });
        });
      }
    });
};

UserController.retrieve = (req, res) => {
  User.findByPk(req.params.userId)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).send();
      }
    });
};

UserController.update = (req, res) => {
  res.send('User updated');
};

UserController.delete = (req, res) => {
  res.send('User deleted');
};

// TODO this method sould be use by the middleware
UserController.checkToken = (req, res, next) => {
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
module.exports = UserController;
