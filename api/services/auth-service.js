'use strict';

var { randtoken } = require('../config/dependencies');

var AuthService = {};
AuthService.name = 'AuthService';

AuthService.create = function(email) {
    var auth = {};
    auth.email = email;
    auth.accessToken = randtoken.generate(128);
    return auth;
};

module.exports = AuthService;