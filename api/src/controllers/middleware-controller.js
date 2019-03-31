'use strict';

var { Auth } = require('../models');

var MiddlewareController = {};
MiddlewareController.name = 'MiddlewareController';

MiddlewareController.isUserAuthenticated = async(req, res, next) => {
  var accessToken = req.headers['x-auth'];
  if (typeof accessToken !== 'undefined') {
    var auth = await Auth.findOne({ where: {accessToken} });
    if (!auth || req.params.userId !== auth.userId) {
      res.status(401).send('Unauthorized.');
    }
  } else {
    res.status(401).send('Unauthorized.');
  }
  next();
};

module.exports = MiddlewareController;
