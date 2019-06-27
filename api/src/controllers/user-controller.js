'use strict';

var { log } = require('../config/dependencies');
var { UserService, AuthService, PasswordService } = require('../services');
var { UserMapper } = require('../mappers');

var UserController = {};
UserController.name = 'UserController';

UserController.create = async(req, res, next) => {
  try {
    req.body.isBot = false;
    req.body.callbackOnMention = null;
    var user = await UserService.create(req.body);
    var auth = await AuthService.create(user.id);
    user = UserMapper.map(user, auth);
    log.info('Successfully created user.');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

UserController.recoveryPassword = async(req, res, next) => {
  try {
    await PasswordService.recoveryPassword(req.body.email);
    log.info('Successfully sent recovery email.');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

UserController.getProfile = async(req, res, next) => {
  try {
    var profile = await UserService.getProfile(req.params.userId);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

UserController.updatePassword = async(req, res, next) => {
  try {
    await UserService.updatePassword(req.params.userId, req.body);
    log.info('Successfully updated password.');
    res.status(200).send();
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
    var user = await UserService.update(req.params.userId, req.body);
    if (!user) {
      log.info('The requested user doesn\'t exist.');
      return res.status(404).send();
    }
    user = UserMapper.map(user);
    log.info('Successfully updated user data.');
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
    log.info('Successfully deleted user.');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

UserController.stats = async(req, res, next) => {
  try {
    var rows = await UserService.getNewUserStats(req.query.from, req.query.to);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

module.exports = UserController;
