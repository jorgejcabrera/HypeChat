'use strict';

var { fs, path, Sequelize } = require('../config/dependencies');
var config = Sequelize.config;

var sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

var models = {};

fs.readdirSync(__dirname)
.filter(file => {
    return (file.indexOf('.') !== 0) 
        && (file !== path.basename(__filename)) 
        && (file.slice(-3) === '.js');
}).forEach(file => {
    var filePath = path.join(__dirname, file);
    var model = sequelize.import(filePath);
    models[model.name] = model;
});

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;