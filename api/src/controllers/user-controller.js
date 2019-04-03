'use strict';

var { UserService, AuthService } = require('../services');
var { UserMapper } = require('../mappers');

var UserController = {};
UserController.name = 'UserController';

/* TODO
  1- maybe we should validate all user pwd: at least n number etc.
*/
UserController.create = async(req, res, next) => {
  var user = await UserService
    .create(req.body)
    .catch((err) => next(err));
  if (user) {
    var auth = await AuthService
      .create(user.id)
      .catch((err) => next(err));
    user = UserMapper.map(user, auth);
    res.json(user);
  }
};

UserController.retrieve = async(req, res, next) => {
  var user = await UserService
    .getById(req.params.userId)
    .catch((err) => next(err));
  if (user) {
    user = UserMapper.map(user);
    res.json(user);
  } else {
    res.status(404).send();
  }
};

UserController.update = (req, res, next) => {
  res.send('User updated');
};

UserController.delete = (req, res, next) => {
  res.send('User deleted');
};

module.exports = UserController;
