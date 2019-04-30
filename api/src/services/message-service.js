'use strict';

var { Message, MessageRecipient } = require('../models');
var { amqp } = require('../config/dependencies');
var MessageService = {};
var messageQueue = 'messageQueue';
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

  // sending data to rabbit queue
  amqp.then(function(conn) {
    var ok = conn.createChannel();
    ok = ok.then(function(ch) {
      ch.assertQueue(messageQueue);
      ch.sendToQueue(messageQueue, 
      new Buffer('{"recipientId": ' + recipientId + ',"senderId": ' + senderId + "}"));
    });
    return ok;
  }).then(null, console.warn);
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

