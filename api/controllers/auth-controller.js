'use strict';

var { Auth, User } = require('../models');
var { AuthService } = require('../services');
var { bcrypt } = require('../config/dependencies');
var AuthController = {};
AuthController.name = 'AuthController';

//TODO move logic to auth service
AuthController.login = (req, res) => {
    User.findOne({ where: {email: req.body.email} })
        .then( user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, function(err,eq) {
                    if (eq) {
                        Auth.create(AuthService.create(req.body.email))
                        .then((auth) => res.json(auth.accessToken));
                    } else {
                        res.status(403).send();
                    }
                });
            } else {
                res.status(404).send();
            }
        });
};

AuthController.logout = (req, res) => {
    res.send('logout');
};

module.exports = AuthController;
