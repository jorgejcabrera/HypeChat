'use strict';

var { AuthController } = require('../controllers');

module.exports = (app) => {
  app.route('/login')
    .post(AuthController.login);

  app.route('/logout')
    .post(AuthController.logout);
};
