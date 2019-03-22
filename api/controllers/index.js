'use strict';

var { fs, path } = require('../config/dependencies');

var controllers = {};

fs.readdirSync(__dirname)
.filter((file) => {
    return (file.indexOf('.') !== 0) 
        && (file !== path.basename(__filename)) 
        && (file.slice(-3) === '.js');
}).forEach((file) => {
    var filePath = path.join(__dirname, file);
    var controller = require(filePath);
    controllers[controller.name] = controller;
});

module.exports = controllers;