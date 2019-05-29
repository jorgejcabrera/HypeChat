'use strict';

var { randtoken, bcrypt } = require('../config/dependencies');
var UserService = require('./user-service');
var { Auth } = require('../models');
var { EmailUtils } = require('../utils');

var AuthService = {};
AuthService.name = 'AuthService';

AuthService.login = async(user, credentials) => {
  if (!user) {
    var normalizedEmail = EmailUtils.normalize(credentials.email);
    user = await UserService.getByEmail(normalizedEmail);
    if (!user) {
      var e = new Error();
      e.name = 'InvalidCredentials';
      throw e;
    }

    var valid = await AuthService.authenticate(user, credentials.password);
    if (!valid) {
      e = new Error();
      e.name = 'InvalidCredentials';
      throw e;
    }
  }

  UserService.updateFirebaseToken(user.id, credentials.firebaseToken);
  await AuthService.destroyByUser(user.id);
  return await AuthService.create(user.id);
};

AuthService.create = async(userId) => {
  var auth = await Auth.create({
    userId: userId,
    accessToken: randtoken.generate(128),
  });
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
