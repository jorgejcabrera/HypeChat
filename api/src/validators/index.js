'use strict';

var FileUtils = require('../utils/file-utils');

var validators = {};

FileUtils.processFilesInDir(__dirname, __filename, (filepath) => {
  var validator = require(filepath);
  validators[validator.name] = validator;
});

module.exports = validators;
