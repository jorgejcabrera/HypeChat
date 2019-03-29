'use strict';

var { User, Auth } = require('../models');
var { AuthService } = require('../services');
var { bcrypt } = require('../config/dependencies');

const saltRounds = 10;
var UserController = {};

UserController.name = 'UserController';

UserController.create = (req, res) => {

  bcrypt.hash(req.body.password,saltRounds, function(err, hash){
    /*TODO
      1. normalize email: remove blanck mark
      2. validate email format
    */
    req.body.password = hash;

    //TODO ignore pwd attribute in json response. May be we should use a mapper.
    User.create(req.body)
    .then((user) => {
      Auth.create(AuthService.create(req.body.email));
      res.json(user)
    });
  });
};

UserController.retrieve = (req, res) => {
  User.findByPk(req.params.userId)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).send();
      }
    });
};

UserController.update = (req, res) => {
  res.send('User updated');
};

UserController.delete = (req, res) => {
  res.send('User deleted');
};

module.exports = UserController;
