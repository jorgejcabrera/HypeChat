'use strict';

var { MessageController } = require('../controllers');

module.exports = (app) => {
  app.route('/user_recipient/:recipientId/messages')
    .post(MessageController.send)
    .get(MessageController.retrieveSendedMessages);

  app.route('/user_sender/:senderId/messages')
    .get(MessageController.retrieveRecipientMessages);

  /*app.route('/group_recipient/:recipientId/messages')
    .get(MessageController.retrieve);*/
};
