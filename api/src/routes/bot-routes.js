'use strict';

var { BotController } = require('../controllers');
var { AuthHandler } = require('../middleware');

module.exports = (app) => {
  app.route('/bots')
    .post(
      AuthHandler.authorize({ requireAdmin: true }),
      BotController.create
    );
};
