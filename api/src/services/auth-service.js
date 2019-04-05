'use strict';

var { randtoken, bcrypt } = require('../config/dependencies');
var UserService = require('./user-service');
var { Auth } = require('../models');

var AuthService = {};
AuthService.name = 'AuthService';

AuthService.login = async(email, inputPassword) => {
  var user = await UserService.getByEmail(email);
  if (!user) 
    throw new Error('InvalidCredentials');
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
  return req.user.id == Number(req.params.userId);
};

AuthService.authenticate = async(user, inputPassword) => {
  return await bcrypt.compare(inputPassword, user.password);
};

module.exports = AuthService;
