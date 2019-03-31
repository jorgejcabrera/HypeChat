'use strict';

var { processFilesInDir } = require('../bin/helpers');

var mappers = {};

processFilesInDir(__dirname, __filename, (filepath) => {
  var mapper = require(filepath);
  mappers[mapper.name] = mapper;
});

module.exports = mappers;
