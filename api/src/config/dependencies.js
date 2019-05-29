'use strict';

var Sequelize = require('sequelize');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger/config.json');
var env = process.env.NODE_ENV || 'development';
Sequelize.config = require('./sequelize/config.json')[env];

module.exports = {
  debug: require('debug')('hypechat:server'),
  fs: require('fs'),
  path: require('path'),
  Sequelize: Sequelize,
  express: require('express'),
  _: require('lodash'),
  moment: require('moment'),
  logger: require('morgan'),
  bcrypt: require('bcrypt'),
  randtoken: require('rand-token'),
  normalizeemail: require('normalize-email'),
  swaggerUi: swaggerUi,
  swaggerDocument: swaggerDocument,
  firebaseAdmin: require('firebase-admin'),
};
