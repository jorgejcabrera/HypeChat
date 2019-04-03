'use strict';

var ErrorHandler = {};

ErrorHandler.name = 'ErrorHandler';

ErrorHandler.default = (err, req, res, next) => {
  var response = {
    status: 500,
    json: {},
  };

  if (err.name === 'SequelizeValidationError') {
    response.status = 400;
    response.json.type = 'validationError';
    response.json.validationErrors = [];
    // response.json.raw = err;

    err.errors.forEach((error) => {
      switch (error.type) {
        case 'notNull Violation':
          response.json.validationErrors.push({
            error: 'isBlank',
            path: error.path,
          });
          break;
      }
    });
  }

  if (err.name === 'NoResultsFoundOnSearch'){
    response.status = 404;
    response.json.message = 'No results found, please try again ' +
        'with another address.';
  }

  res.status(response.status).json(response.json);
};

module.exports = ErrorHandler;