'use strict';

require('dotenv').config();

var Sequelize = require('sequelize');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger/config.json');

var env = process.env.NODE_ENV || 'development';
Sequelize.config = require('./sequelize/config.json')[env];

// Configure logger.
var initLog = () => {
  var log = require('loglevel');
  var prefix = require('loglevel-plugin-prefix');
  var chalk = require('chalk');
  var colors = {
    TRACE: chalk.magenta,
    DEBUG: chalk.cyan,
    INFO: chalk.blue,
    WARN: chalk.yellow,
    ERROR: chalk.red,
  };

  prefix.reg(log);
  prefix.apply(log, {
    timestampFormatter(date) {
      return moment(date).format('YYYY-MM-DD hh:mm:ss');
    },
    format(level, name, timestamp) {
      return `${colors[level.toUpperCase()](`[${timestamp}] ${level}:`)}`;
    },
  });

  log.stream = {
    write: function(message, encoding){
      log.info(message.replace(/\n/g, ''));
    },
  };

  log.enableAll();
  var logLevel = process.env.LOG_LEVEL || 'INFO';
  log.info('Log level set to: ' + logLevel);
  log.setLevel(logLevel);

  return log;
};

var moment = require('moment');
var log = initLog();

module.exports = {
  fs: require('fs'),
  path: require('path'),
  Sequelize: Sequelize,
  express: require('express'),
  _: require('lodash'),
  moment: moment,
  log: log,
  morgan: require('morgan'),
  bcrypt: require('bcrypt'),
  randtoken: require('rand-token'),
  normalizeemail: require('normalize-email'),
  swaggerUi: swaggerUi,
  swaggerDocument: swaggerDocument,
  firebaseAdmin: require('firebase-admin'),
  passport: require('passport'),
  FacebookStrategy: require('passport-facebook-token'),
  jwt: require('jsonwebtoken'),
  nodemailer: require('nodemailer'),
  request: require('request-promise'),
};
