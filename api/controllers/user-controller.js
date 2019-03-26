'use strict';

var { User } = require('../models');
var { bcrypt } = require('../config/dependencies');

const saltRounds = 10;
var UserController = {};

UserController.name = 'UserController';

UserController.create = (req, res) => {
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(req.body.password, salt);
  req.body.password = hash;
  User.create(req.body)
    .then((user) => res.json(user));
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

module.exports = UserController;
