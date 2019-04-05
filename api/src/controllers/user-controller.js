'use strict';

var { UserService, AuthService } = require('../services');
var { UserMapper } = require('../mappers');

var UserController = {};
UserController.name = 'UserController';

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
  if (!user)
    return res.status(404).send();
  user = UserMapper.map(user);
  res.json(user);
};

UserController.update = async(req, res, next) => {
  var isAuthorized = await AuthService.isAuthorized(req);
  if (!isAuthorized)
    return res.status(403).send();
  var user = await UserService
    .udpate(req.params.userId, req.body)
    .catch((err) => next(err));
  if (!user)
    return res.status(404).send();
  user = UserMapper.map(user);
  res.json(user);
};

UserController.delete = (req, res, next) => {
  res.send('User deleted');
};

module.exports = UserController;
