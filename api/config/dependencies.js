module.exports = {
    debug: require('debug')('hypechat:server'),
    fs: require('fs'),
    path: require('path'),
    Sequelize: require('sequelize'),
    express: require('express'),
    logger: require('morgan')
};