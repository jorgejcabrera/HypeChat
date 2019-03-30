'use strict';

var { AuthController, MiddlewareController } = require('../controllers');

module.exports = (app) => {
  app.route('/login')
    .post(AuthController.login);

  app.route('/logout')
    .post(MiddlewareController.isUserAuthenticated, AuthController.logout);
};
