'use strict';

var { fs, path, Sequelize } = require('../config/dependencies');

var sequelize = new Sequelize('hypechat','hypechat','hypechat', {
    host: 'postgres',
    dialect: 'postgres',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

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