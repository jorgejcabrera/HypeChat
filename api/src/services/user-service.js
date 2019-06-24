'use strict';

var { User } = require('../models');
var { EmailUtils } = require('../utils');
var { PwdValidator } = require('../validators');
var WorkspaceService = require('./workspace-service');
var MessageService = require('./message-service');
var { UserMapper } = require('../mappers');
var { bcrypt, Sequelize, moment } = require('../config/dependencies');
const saltRounds = 10;

var UserService = {};
UserService.name = 'UserService';

UserService.updatePassword = async(userId, payload) => {
  var user = await UserService.getById(userId);
  if (!user) {
    var e = new Error();
    e.name = 'ResourceNotFound';
    throw e;
  }
  var valid = await bcrypt.compare(payload.currentPassword, user.password);
  if (!valid) {
    e = new Error();
    e.name = 'InvalidCredentials';
    throw e;
  }
  user.password = await bcrypt.hash(payload.newPassword, saltRounds);
  return await User.update(user, {
    returning: true,
    where: { id: userId },
  });
};

UserService.recoveryPassword = async(email) => {
  var user = await UserService.getByEmail(email);
  if (!user) {
    var e = new Error();
    e.name = 'ResourceNotFound';
    throw e;
  }
  var newPassword = Math.random().toString(36).substring(7);
  user.password = await bcrypt.hash(newPassword, saltRounds);
  await User.update(user, {
    returning: true,
    where: { id: user.id },
  });
  return newPassword;
};

UserService.getProfile = async(userId) => {
  var user = await UserService.getById(userId);
  if (!user) {
    var e = new Error();
    e.name = 'ResourceNotFound';
    throw e;
  }
  var workspaces = await WorkspaceService
    .retrieveWorkspacesByUser(userId);
  var messages = await MessageService
    .getByUserId(userId);
  return UserMapper.mapProfile(user, workspaces, messages);
};

UserService.create = async(userData) => {
  if (userData.password && !PwdValidator.isValid(userData.password)){
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
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, saltRounds);
  }
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

UserService.getByFacebookId = async(facebookId) => {
  var user = await User.findOne({
    where: {
      facebookId: facebookId,
      status: 'ACTIVE',
    },
  });

  return user && user.toJSON();
};

UserService.update = async(id, newUserData) => {
  // TODO: validar password, hashearla, remover campos que no
  // son updateables.
  var user = await UserService.getById(id);
  if (!user) {
    return null;
  }

  newUserData = Object.assign({}, user, newUserData);

  await User.update(newUserData, {
    returning: true,
    where: { id: id },
  });

  return newUserData;
};

UserService.updateFirebaseToken = async(id, token) => {
  if (!token) return;

  await User.update({ firebaseToken: null }, {
    where: { firebaseToken: token },
    validate: false,
  });

  await UserService.update(id, { firebaseToken: token });
};

UserService.delete = async(userId) => {
  var user = await UserService.getById(userId);
  if (!user) {
    return null;
  }
  // TODO DESTROY all tokens before delete user
  return await UserService.update(userId, {
    status: 'INACTIVE',
    email: EmailUtils.createPrefix(10) + user.email,
  });
};

UserService.getNewUserStats = async(fromDate, toDate) => {
  var users = await User.findAll({
    where: {
      createdAt: {
        [Sequelize.Op.gt]: moment(fromDate, 'YYYY-MM-DD').startOf('day'),
        [Sequelize.Op.lt]: moment(toDate, 'YYYY-MM-DD').endOf('day'),
      },
    },
    attributes: [
      Sequelize.fn('count', Sequelize.col('id')),
      Sequelize.fn('date', Sequelize.col('createdAt')),
    ],
    group: Sequelize.fn('date', Sequelize.col('createdAt')),
    raw: true,
  });

  var newUserStats = {};
  newUserStats.total = 0;
  newUserStats.summary = {};
  users.forEach((dayData) => {
    dayData.count = parseInt(dayData.count, 10);
    newUserStats.total += dayData.count;
    newUserStats.summary[dayData.date] = {
      total: dayData.count,
      accumulated: newUserStats.total,
    };
  });

  return newUserStats;
};

module.exports = UserService;
