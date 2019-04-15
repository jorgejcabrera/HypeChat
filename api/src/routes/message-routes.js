'use strict';

var { MessageController } = require('../controllers');

module.exports = (app) => {
  app.route('/user_recipient/:userId/message')
    .post(MessageController.send);

  app.route('/user/:userId/messages')
    .get(MessageController.retrieve);
};
