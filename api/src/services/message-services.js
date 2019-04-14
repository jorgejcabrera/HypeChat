'use strict';

var { Message, MessageRecipient } = require('../models');

var MessageService = {};
MessageService.name = 'MessageService';

MessageService.send = async(user, messageData) => {
  var message = await Message.create(messageData);
  var messageRecipient = await MessageRecipient.create({
      recipientId: user,
      messageId: message.id,
  });
  return message && message.toJSON();
};

module.exports = MessageService;

