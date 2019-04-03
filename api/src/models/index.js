'use strict';

var { FileUtils } = require('../utils');
var { Sequelize } = require('../config/dependencies');

var sequelize;
if (Sequelize.config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[Sequelize.config.use_env_variable],
    Sequelize.config
  );
} else {
  sequelize = new Sequelize(
    Sequelize.config.database,
    Sequelize.config.username,
    Sequelize.config.password,
    Sequelize.config
  );
}

var models = {};
models.Database = sequelize;

FileUtils.processFilesInDir(__dirname, __filename, (filepath) => {
  var model = sequelize.import(filepath);
  models[model.name] = model;
});

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
