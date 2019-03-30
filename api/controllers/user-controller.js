'use strict';

var { User, Auth } = require('../models');
var { AuthService } = require('../services');
var { EmailUtils } = require('../utils');
var { bcrypt } = require('../config/dependencies');

const saltRounds = 10;
var UserController = {};
UserController.name = 'UserController';

/* TODO
  1- maybe we should validate all user pwd: at least n number etc.
*/
UserController.create = async(req, res) => {
  var email = EmailUtils.normalize(req.body.email);
  var user = await User.findOne({ where: {email} });

  if (user) {
    res.status(400).send('User already exists.');
  } else {
    var hash = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = hash;
    req.body.email = email;
    user = await User.create(req.body);
    Auth.create(AuthService.create(user.id));
    res.json(user);
  }
};

UserController.retrieve = async(req, res) => {
  var user = await User.findByPk(req.params.userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send();
  }
};

UserController.update = (req, res) => {
  res.send('User updated');
};

UserController.delete = (req, res) => {
  res.send('User deleted');
};

module.exports = UserController;
