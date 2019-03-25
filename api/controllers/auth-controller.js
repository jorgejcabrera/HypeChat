'use strict';

var { Auth } = require('../models');

var AuthController = {};

AuthController.name = 'AuthController';

//TODO move logic to auth service
AuthController.login = (req, res) => {
    Auth.findOne({ where: {email: req.body.email} })
        .then( auth => {
            if (auth) {
                res.status(400).send();
            } else {
                Auth.create(req.body)
                    .then((auth) => res.json(auth));
            }
        });
};

AuthController.logout = (req, res) => {
    res.send('logout');
};

module.exports = AuthController;
