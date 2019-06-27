'use strict';

var { log } = require('../config/dependencies');

var ErrorHandler = {};
ErrorHandler.name = 'ErrorHandler';

var handleSequelizeErrors = (err, response) => {
  response.status = 400;
  response.json.type = 'validationError';
  response.json.validationErrors = [];
  // response.json.raw = err;

  err.errors.forEach((error) => {
    if (error.type === 'Validation error') {
      error.type = error.validatorKey;
    }

    switch (error.type) {
      case 'notNull Violation':
        log.info('Validation error: ', error.path, 'can\'t be null.');
        response.json.validationErrors.push({
          error: 'isBlank',
          path: error.path,
        });
        break;
      case 'isEmail':
        log.info('Validation error: ', error.path, 'is not a valid email.');
        response.json.validationErrors.push({
          error: 'invalidEmail',
          path: error.path,
        });
        break;
      case 'atLeastOneLogin':
        log.info('Validation error: No login information specified.');
        response.json.validationErrors.push({
          error: 'noLoginSpecified',
        });
        break;
      default:
        log.warn('Don\'t know how to handle: ', error);
        break;
    }
  });
};

ErrorHandler.default = (err, req, res, next) => {
  var response = {
    status: 500,
    json: { status: 'error' },
  };

  switch (err.name) {
    case 'SequelizeValidationError':
      handleSequelizeErrors(err, response);
      break;
    case 'SequelizeHostNotFoundError':
      log.error('Database connection seems to be down, ' +
        'please check that the database is running.');
      break;
    case 'UserAlreadyExists':
      log.info('User already exists.');
      response.status = 400;
      response.json.type = 'userAlreadyExists';
      break;
    case 'InvalidUserPwd':
      log.info('Invalid password.');
      response.status = 400;
      response.json.type = 'invalidUserPwd';
      break;
    case 'ForbiddenWordAlreadyExists':
      log.info('Forbidden word already exists.');
      response.status = 400;
      response.json.type = 'forbiddenWordAlreadyExists';
      break;
    case 'ForbiddenWordDoesNotBelongToWorkspace':
      log.info('Forbidden word does not belong to workspace.');
      response.status = 403;
      response.json.type = 'forbiddenWordDoesNotBelongToWorkspace';
      break;
    case 'ResourceNotFound':
      log.info('Requested resourse was not found.');
      response.status = 404;
      response.json.type = 'resourceNotFound';
      break;
    default:
      log.warn('Don\'t know how to handle: ', err);
      break;
  }

  res.status(response.status).json(response.json);
};

module.exports = ErrorHandler;
