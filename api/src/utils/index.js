'use strict';

var FileUtils = require('../utils/file-utils');

var utils = {};

FileUtils.processFilesInDir(__dirname, __filename, (filepath) => {
  var util = require(filepath);
  utils[util.name] = util;
});

module.exports = utils;
