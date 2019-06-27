'use strict';

var { FileUtils } = require('../utils');
var { Sequelize, log } = require('../config/dependencies');

Sequelize.config.logging = (msg) => log.debug(msg);
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

sequelize
  .authenticate()
  .then(() => {
    log.info('Database connection successful!');
  })
  .catch((err) => {
    if (err) {
      log.error('Can\'t establish a connection to the database.');
    }
  });

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
