'use strict';

var { Message, MessageRecipient } = require('../models');

var MessageService = {};
MessageService.name = 'MessageService';

MessageService.send =
async(recipientId, messageData, senderId, workspaceId) => {
  var message = await Message.create({
    creatorId: senderId,
    messageBody: messageData.messageBody,
  });
  await MessageRecipient.create({
    recipientId: recipientId,
    workspaceId: workspaceId,
    messageId: message.id,
  });
  return message && message.toJSON();
};

MessageService.retrieveMessages = async(recipientId, senderId, workspaceId) => {
  var messageRecipient;
  try {
    messageRecipient = await MessageRecipient.findAll({
      where: {
        recipientId: recipientId,
        workspaceId: workspaceId,
      },
      include: [{
        model: Message,
        as: 'message',
        where: { creatorId: senderId},
      }],
      raw: true,
    });
  } catch (err) {
    // TODO put here some logs
    throw err;
  }
  return messageRecipient;
};

// TODO
MessageService.retrieveGroupMessages = async(req) => {

};

module.exports = MessageService;

