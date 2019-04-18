'use strict';

var { Message, MessageRecipient } = require('../models');

var MessageService = {};
MessageService.name = 'MessageService';

MessageService.send = async(recipientId, messageData, senderId) => {
  var message = await Message.create({
    creatorId: senderId,
    messageBody: messageData.messageBody,
  });
  await MessageRecipient.create({
    recipientId: recipientId,
    messageId: message.id,
  });
  return message && message.toJSON();
};

/* TODO We must have an index by 
  - recipientId colum in message_recipient table
  - creatorId colum in message table
*/
MessageService.retrieveMessages = async(recipientId,senderId) => {
  var messageRecipient;
  try {
    messageRecipient = await MessageRecipient.findAll({
      where: { recipientId: recipientId },
      include: [{ 
        model: Message, 
        as: 'message',
        where: { creatorId: senderId,}, 
      }],
      raw: true,
    });
  } catch (err) {
    // TODO put here some logs
    throw err;
  }
  return messageRecipient;
};

//TODO
MessageService.retrieveGroupMessages = async(req) => {

};

module.exports = MessageService;

