'use strict';

var { MessageController } = require('../controllers');

module.exports = (app) => {
  app.route('/workspace/:workspaceId/user_recipient/:recipientId/messages')
    .post(MessageController.send)
    .get(MessageController.retrieveSendedMessages);

  app.route('/workspace/:workspaceId/user_recipient/:recipientId/chat')
    .get(MessageController.retrieveChat);

  app.route('/workspace/:workspaceId/user_sender/:senderId/messages')
    .get(MessageController.retrieveMessages);

  /* app.route('/group_recipient/:recipientId/messages')
    .get(MessageController.retrieve);*/

  app.route('/messages')
    .post(MessageController.sendMessage);
};
