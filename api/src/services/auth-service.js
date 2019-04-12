'use strict';

var { randtoken, bcrypt } = require('../config/dependencies');
var UserService = require('./user-service');
var { Auth } = require('../models');
var { EmailUtils } = require('../utils');

var AuthService = {};
AuthService.name = 'AuthService';

AuthService.login = async(email, inputPassword) => {
  var normalizedEmail = EmailUtils.normalize(email);
  var user = await UserService.getByEmail(normalizedEmail);
  if (!user)
    throw new Error('InvalidCredentials');
  // TOGO if user is inactive then can not login
  var valid = await AuthService.authenticate(user, inputPassword);
  if (valid) {
    await AuthService.destroyByUser(user.id);
    var auth = await AuthService.create(user.id);
    return auth;
  }
};

AuthService.create = async(userId) => {
  var auth = {};
  auth.userId = userId;
  auth.accessToken = randtoken.generate(128);
  auth = await Auth.create(auth);
  return auth && auth.toJSON();
};

AuthService.destroyByUser = async(userId) => {
  await Auth.destroy({ where: {userId} });
};

AuthService.destroyByToken = async(accessToken) => {
  await Auth.destroy({ where: {accessToken} });
};

AuthService.isAuthorized = async(req) => {
  return req.user != null && req.user.id === Number(req.params.userId);
};

AuthService.authenticate = async(user, inputPassword) => {
  return await bcrypt.compare(inputPassword, user.password);
};

module.exports = AuthService;
