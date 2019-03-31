'use strict';

var { randtoken, bcrypt } = require('../config/dependencies');
var { Auth } = require('../models');

var AuthService = {};
AuthService.name = 'AuthService';

AuthService.create = async(userId) => {
  var auth = {};
  auth.userId = userId;
  auth.accessToken = randtoken.generate(128);
  auth = await Auth.create(auth);
  return auth;
};

AuthService.destroyByUser = async(userId) => {
  await Auth.destroy({ where: {userId} });
};

AuthService.destroyByToken = async(accessToken) => {
  await Auth.destroy({ where: {accessToken} });
};

AuthService.authenticate = async(user, inputPassword) => {
  return await bcrypt.compare(inputPassword, user.password);
};

module.exports = AuthService;
