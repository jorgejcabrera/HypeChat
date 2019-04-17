'use strict';

var { MessageController } = require('../controllers');

module.exports = (app) => {
  app.route('/user_recipient/:recipientId/message')
    .post(MessageController.send);

  app.route('/user_recipient/:recipientId/conversation')
    .get(MessageController.retrieve);

  app.route('/group_recipient/:recipientId/messages')
    .get(MessageController.retrieve);
};
