'use strict';

var { FileUtils } = require('../utils');

var services = {};

FileUtils.processFilesInDir(__dirname, __filename, (filepath) => {
  var service = require(filepath);
  services[service.name] = service;
});

module.exports = services;
