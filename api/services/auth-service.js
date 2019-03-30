'use strict';

var { randtoken } = require('../config/dependencies');

var AuthService = {};
AuthService.name = 'AuthService';

AuthService.create = function(userId) {
  var auth = {};
  auth.userId = userId;
  auth.accessToken = randtoken.generate(128);
  return auth;
};

module.exports = AuthService;
