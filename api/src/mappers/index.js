'use strict';

var { FileUtils } = require('../utils');

var mappers = {};

FileUtils.processFilesInDir(__dirname, __filename, (filepath) => {
  var mapper = require(filepath);
  mappers[mapper.name] = mapper;
});

module.exports = mappers;
