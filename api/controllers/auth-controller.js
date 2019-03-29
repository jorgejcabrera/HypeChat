'use strict';

var { Auth, User } = require('../models');
var { AuthService } = require('../services');
var { EmailUtils } = require('../utils');
var { bcrypt } = require('../config/dependencies');
var AuthController = {};
AuthController.name = 'AuthController';

AuthController.login = (req, res) => {
    var email = EmailUtils.normalize(req.body.email);
    User.findOne({ where: {email} })
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
