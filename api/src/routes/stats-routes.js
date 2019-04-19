'use strict';

var { UserController } = require('../controllers');

module.exports = (app) => {

  app.route('/stats/users')
    .get(UserController.stats);
};
