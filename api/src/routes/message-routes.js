'use strict';

var { MessageController } = require('../controllers');

module.exports = (app) => {
  app.route('/messages')
    .post(MessageController.send);

  app.route('/users/:userId/messages')
    .get(MessageController.retrieve);
};
