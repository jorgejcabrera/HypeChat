'use strict';

var { Message, MessageRecipient } = require('../models');

var MessageService = {};
MessageService.name = 'MessageService';

MessageService.send = async(user, messageData) => {
  var message = await Message.create(messageData);
  await MessageRecipient.create({
    recipientId: user,
    messageId: message.id,
  });
  return message && message.toJSON();
};

// TODO We must have an index by recipientId colum
MessageService.retrieveUserMessages = async(req) => {
  var recipientId = req.params.userId;
  var messageRecipient;
  try {
    messageRecipient = await MessageRecipient.findAll({
      where: { recipientId: recipientId },
      include: [{ model: Message, as: 'message' }],
      raw: true,
    });
  } catch (ex) {
    // TODO put here some logs
    throw ex;
  }
  return messageRecipient;
};

MessageService.retrieveGroupMessages = async(req) => {

};

module.exports = MessageService;

