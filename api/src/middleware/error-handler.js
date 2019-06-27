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
        log.warn('Validation error: ', error.path, 'can\'t be null.');
        response.json.validationErrors.push({
          error: 'isBlank',
          path: error.path,
        });
        break;
      case 'isEmail':
        log.warn('Validation error: ', error.path, 'is not a valid email.');
        response.json.validationErrors.push({
          error: 'invalidEmail',
          path: error.path,
        });
        break;
      case 'atLeastOneLogin':
        log.warn('Validation error: No login information specified.');
        response.json.validationErrors.push({
          error: 'noLoginSpecified',
        });
        break;
      default:
        log.error('Don\'t know how to handle: ', error);
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
      log.warn('User already exists.');
      response.status = 400;
      response.json.type = 'userAlreadyExists';
      break;
    case 'InvalidUserPwd':
      log.warn('Invalid password.');
      response.status = 400;
      response.json.type = 'invalidUserPwd';
      break;
    case 'ForbiddenWordAlreadyExists':
      log.warn('Forbidden word already exists.');
      response.status = 400;
      response.json.type = 'forbiddenWordAlreadyExists';
      break;
    case 'ForbiddenWordDoesNotBelongToWorkspace':
      log.warn('Forbidden word does not belong to workspace.');
      response.status = 403;
      response.json.type = 'forbiddenWordDoesNotBelongToWorkspace';
      break;
    case 'ResourceNotFound':
      log.warn('Requested resourse was not found.');
      response.status = 404;
      response.json.type = 'resourceNotFound';
      break;
    default:
      log.error('Don\'t know how to handle: ', err);
      break;
  }

  res.status(response.status).json(response.json);
};

module.exports = ErrorHandler;
