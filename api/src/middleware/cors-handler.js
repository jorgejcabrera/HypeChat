'use strict';

var CorsHandler = {};

CorsHandler.name = 'CorsHandler';

CorsHandler.cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-Auth, X-Client'
  );
  next();
};

module.exports = CorsHandler;
