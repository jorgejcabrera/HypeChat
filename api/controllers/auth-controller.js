'use strict';

var { Auth } = require('../models');

var AuthController = {};

AuthController.name = 'AuthController';

AuthController.login = (req, res) => {
    Auth.create(req.body)
        .then((auth) => res.json(auth));
};

AuthController.logout = (req, res) => {
    res.send('logout');
};

module.exports = AuthController;
