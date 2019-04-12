'use strict';

var { User } = require('../models');
var { EmailUtils } = require('../utils');
var { PwdValidator, UserValidator } = require('../validators');

var { bcrypt, Sequelize } = require('../config/dependencies');

const saltRounds = 10;

var UserService = {};
UserService.name = 'UserService';

UserService.create = async(userData) => {
  userData.email = EmailUtils.normalize(userData.email);
  var user = await User.findOne({ where: {email: userData.email} });

  if (!PwdValidator.isValid(userData)){
    var pe = new Error();
    pe.name = 'InvalidUserPwd';
    throw pe;
  }

  if (!user) {
    userData.password = await bcrypt.hash(userData.password, saltRounds);
    userData.status = 'ACTIVE';
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
  if (user && !UserValidator.isActive(user))
    return null;
  return user && user.toJSON();
};

UserService.getByEmail = async(email) => {
  email = EmailUtils.normalize(email);
  var user = await User.findOne({ where: {email} });
  if (user && !UserValidator.isActive(user))
    return null;
  return user && user.toJSON();
};

UserService.udpate = async(id, body) => {
  var user = await User
    .findByPk(id);
  if (!user)
    return null;
  if (!UserValidator.isActive(user)) {
    var e = new Error();
    throw e;
  }
  var updated = await User.update(body, {
    returning: true,
    where: {id: id },
  });
  return updated[1][0] && updated[1][0].toJSON();
};

UserService.delete = async(userId) => {
  var user = await User.findByPk(userId);
  if (!user)
    return null;
  // TODO DESTROY all tokens before delete user
  var updated = await User.update(
    { status: 'INACTIVE',
      email: EmailUtils.createPrefix(10) + user.email}, {
      returning: true,
      where: {id: userId },
    });
  return updated[1][0] && updated[1][0].toJSON();
};

UserService.findAllBetween = async(req) => {
  var users = await User.findAll({
    where: {
      createdAt:
        Sequelize.where(
          Sequelize.fn('date', Sequelize.col('createdAt')),
          '>', req.query.from) &&
        Sequelize.where(
          Sequelize.fn('date', Sequelize.col('createdAt')),
          '<', req.query.to),
    }, 
    raw: true
  });
  return users;
};

module.exports = UserService;
