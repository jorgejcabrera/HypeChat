'use strict';

var { User } = require('../models');
var { EmailUtils } = require('../utils');
var { PwdValidator } = require('../validators');

var { bcrypt, Sequelize } = require('../config/dependencies');

const saltRounds = 10;

var UserService = {};
UserService.name = 'UserService';

UserService.create = async(userData) => {
  if (!PwdValidator.isValid(userData.password)){
    var pe = new Error();
    pe.name = 'InvalidUserPwd';
    throw pe;
  }

  userData.email = EmailUtils.normalize(userData.email);
  var user = await User.findOne({ where: {email: userData.email} });

  if (user) {
    var e = new Error();
    e.name = 'UserAlreadyExists';
    throw e;
  }

  userData.password = await bcrypt.hash(userData.password, saltRounds);
  userData.status = 'ACTIVE';
  user = await User.create(userData);
  return user && user.toJSON();
};

UserService.getById = async(userId) => {
  var user = await User.findOne({
    where: {
      id: userId,
      status: 'ACTIVE',
    },
  });

  return user && user.toJSON();
};

UserService.getByEmail = async(email) => {
  var user = await User.findOne({
    where: {
      email: EmailUtils.normalize(email),
      status: 'ACTIVE',
    },
  });

  return user && user.toJSON();
};

UserService.udpate = async(id, newUserData) => {
  // TODO: validar password, hashearla, remover campos que no
  // son updateables.
  var user = await UserService.getById(id);
  if (!user) {
    return null;
  }

  var updated = await User.update(newUserData, {
    returning: true,
    where: { id: id },
  });

  return updated[1][0] && updated[1][0].toJSON();
};

UserService.delete = async(userId) => {
  var user = await UserService.getById(userId);
  if (!user) {
    return null;
  }
  // TODO DESTROY all tokens before delete user
  var updated = await User.update({
    status: 'INACTIVE',
    email: EmailUtils.createPrefix(10) + user.email,
  }, {
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
    raw: true,
  });
  return users;
};

module.exports = UserService;
