'use strict';

var { User } = require('../models');
var { EmailUtils } = require('../utils');
var { PwdValidator } = require('../validators');

var { bcrypt } = require('../config/dependencies');

const saltRounds = 10;

var UserService = {};
UserService.name = 'UserService';

UserService.create = async(userData) => {
  userData.email = EmailUtils.normalize(userData.email);
  var user = await User.findOne({ where: {email: userData.email} });

  if (!PwdValidator.isValid(userData)){
    var e = new Error();
    e.name = 'InvalidUserPwd';
    throw e;
  }
  
  if (!user) {
    userData.password = await bcrypt.hash(userData.password, saltRounds);
    user = await User.create(userData);
    return user && user.toJSON();
  } else {
    var e = new Error();
    e.name = 'UserAlreadyExists';
    throw e;
  }
};

UserService.getById = async(userId) => {
  var user = await User.findByPk(userId);
  return user && user.toJSON();
};

UserService.getByEmail = async(email) => {
  email = EmailUtils.normalize(email);
  var user = await User.findOne({ where: {email} });
  return user && user.toJSON();
};

module.exports = UserService;
