'use strict';

var { FileUtils } = require('../utils');

var controllers = {};

FileUtils.processFilesInDir(__dirname, __filename, (filepath) => {
  var controller = require(filepath);
  controllers[controller.name] = controller;
});

module.exports = controllers;
