'use strict';

var { UserService, AuthService } = require('../services');
var { UserMapper } = require('../mappers');

var UserController = {};
UserController.name = 'UserController';

UserController.create = async(req, res, next) => {
  try {
    var user = await UserService.create(req.body);
    var auth = await AuthService.create(user.id);
    user = UserMapper.map(user, auth);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

UserController.retrieve = async(req, res, next) => {
  try {
    var user = await UserService.getById(req.params.userId);
    if (!user) {
      return res.status(404).send();
    }
    user = UserMapper.map(user);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

UserController.update = async(req, res, next) => {
  try {
    var isAuthorized = await AuthService.isAuthorized(req);
    if (!isAuthorized) {
      return res.status(403).send();
    }
    var user = await UserService.udpate(req.params.userId, req.body);
    if (!user) {
      return res.status(404).send();
    }
    user = UserMapper.map(user);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

UserController.delete = async(req, res, next) => {
  try {
    var isAuthorized = await AuthService.isAuthorized(req);
    if (!isAuthorized) {
      return res.status(403).send();
    }
    var user = await UserService.delete(req.params.userId);
    user = UserMapper.map(user);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

UserController.stats = async(req, res, next) => {
  try {
    var rows = await UserService.findAllBetween(req);
    res.json(UserMapper.stats(rows));
  } catch (err) {
    next(err);
  }
};

module.exports = UserController;
