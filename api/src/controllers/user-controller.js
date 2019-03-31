'use strict';

var { UserService, AuthService } = require('../services');
var { UserMapper } = require('../mappers');

var UserController = {};
UserController.name = 'UserController';

/* TODO
  1- maybe we should validate all user pwd: at least n number etc.
*/
UserController.create = async(req, res) => {
  var user = await UserService.create(req.body);
  if (user) {
    var auth = await AuthService.create(user.id);
    user = UserMapper.map(user, auth);
    res.json(user);
  } else {
    res.status(400).send('User already exists.');
  }
};

UserController.retrieve = async(req, res) => {
  var user = await UserService.getById(req.params.userId);
  if (user) {
    user = UserMapper.map(user);
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
