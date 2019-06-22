'use strict';

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
        response.json.validationErrors.push({
          error: 'isBlank',
          path: error.path,
        });
        break;
      case 'isEmail':
        response.json.validationErrors.push({
          error: 'invalidEmail',
          path: error.path,
        });
        break;
      case 'atLeastOneLogin':
        response.json.validationErrors.push({
          error: 'noLoginSpecified',
        });
        break;
      default:
        console.error('Don\'t know how to handle: ', error);
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
    case 'UserAlreadyExists':
      response.status = 400;
      response.json.type = 'userAlreadyExists';
      break;
    case 'InvalidUserPwd':
      response.status = 400;
      response.json.type = 'invalidUserPwd';
      break;
    case 'ForbiddenWordAlreadyExists':
      response.status = 400;
      response.json.type = 'forbiddenWordAlreadyExists';
      break;
    case 'ForbiddenWordDoesNotBelongToWorkspace':
      response.status = 403;
      response.json.type = 'forbiddenWordDoesNotBelongToWorkspace';
      break;
    case 'ResourceNotFound':
      response.status = 404;
      response.json.type = 'resourceNotFound';
      break;
    default:
      console.error('Don\'t know how to handle: ', err);
      break;
  }

  if (response.status === 500) {
    console.log(err);
  }
  res.status(response.status).json(response.json);
};

module.exports = ErrorHandler;
