'use strict';

var { AuthController } = require('../controllers');

module.exports = (app) => {
  app.route('/login')
    .post(AuthController.login);

  app.route('/:userId/logout')
    .get(AuthController.logout);
};
