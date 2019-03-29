'use strict';

var { Auth, User } = require('../models');

var AuthController = {};

const saltRounds = 10;
var { bcrypt, randtoken } = require('../config/dependencies');

AuthController.name = 'AuthController';

//TODO move logic to auth service
AuthController.login = (req, res) => {
    User.findOne({ where: {email: req.body.email} })
        .then( user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, function(err,eq) {
                    if (eq) {
                        var auth = {};
                        auth.email = req.body.email;
                        auth.accessToken = randtoken.generate(128);
                        Auth.create(auth)
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
