'use strict';

var { processFilesInDir } = require('../bin/helpers');

var utils = {};

processFilesInDir(__dirname, __filename, (filepath) => {
  var util = require(filepath);
  utils[util.name] = util;
});

module.exports = utils;