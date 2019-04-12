'use strict';

var { UserController } = require('../controllers');

module.exports = (app) => {

  app.route('/users/stats')
    .get(UserController.stats);
};
