'use strict';

var { FileUtils } = require('../utils');

var middleware = {};

FileUtils.processFilesInDir(__dirname, __filename, (filepath) => {
  var mid = require(filepath);
  middleware[mid.name] = mid;
});

module.exports = middleware;
