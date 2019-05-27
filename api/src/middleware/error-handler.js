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
    default:
      console.error(err);
  }

  res.status(response.status).json(response.json);
};

module.exports = ErrorHandler;
