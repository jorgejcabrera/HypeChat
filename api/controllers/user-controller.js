'use strict';

var { User, Auth } = require('../models');
var { AuthService } = require('../services');
var { EmailUtils } = require('../utils');
var { bcrypt } = require('../config/dependencies');

const saltRounds = 10;
var UserController = {};
UserController.name = 'UserController';

UserController.create = (req, res) => {
  var email = EmailUtils.normalize(req.body.email);
  User.findOne({ where: {email} })
    .then((user) => {
      if (user) {
        /*TODO 
          1- return error message: "User already exists."
          2- log error
        */
        res.status(400).send();
      } else {
        bcrypt.hash(req.body.password,saltRounds, function(err, hash){
          req.body.password = hash;
          req.body.email = email;
          /*TODO 
           1- ignore pwd attribute in json response. May be we should use a mapper, 
           or create dto for private and public data.
          */
          User.create(req.body)
          .then((user) => {
            Auth.create(AuthService.create(email));
            res.json(user)
          });
        });
      }
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
