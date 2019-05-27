'use strict';

var { Message, MessageRecipient } = require('../models');
var UserService = require('./user-service');
var FirebaseService = require('./firebase-service');
var { firebaseAdmin } = require('../config/dependencies');


var MessageService = {};
MessageService.name = 'MessageService';

MessageService.send =
async(recipientId, messageData, senderId, workspaceId) => {
  var userRecipient = await UserService.getById(recipientId);
  var payload = {
    notification: {
      title: "Account Deposit",
      body: "A deposit to your savings account has just cleared."
    },
    data: {
      message: messageData.messageBody,
    }
  };
  var options = {
    priority: "high",
    timeToLive: 60 * 60 *24
  };

  FirebaseService.sendNofication(userRecipient.firebaseToken, payload, options);

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

