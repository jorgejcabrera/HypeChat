'use strict';

var { firebaseAdmin, moment, log } = require('../config/dependencies');
var { Group } = require('../models');
var UserService = require('./user-service');
var MessageService = require('./message-service');

var FirebaseService = {};
FirebaseService.name = 'FirebaseService';

FirebaseService.sendAddedToGroupNofication = async(recipientId, contents) => {
  var tokens = [];
  var recipient = await UserService.getById(recipientId);
  if (recipient && recipient.firebaseToken) {
    tokens.push(recipient.firebaseToken);
  } else {
    log.warn('Either user doesn\'t exist, or has no firebase token. Skipping.');
  }

  if (tokens.length === 0) return;

  var payload = {
    notification: contents,
    tokens: tokens,
  };

  await firebaseAdmin.messaging().sendMulticast(payload);
};

FirebaseService.sendMessageNofication = async(sender, messageData) => {
  try {
    var tokens = [];
    if (messageData.groupId) {
      var group = await Group.findOne({
        where: { id: messageData.groupId },
        include: [
          { association: 'users' },
        ],
      });

      if (group) {
        tokens = group.users
          .filter((user) => user.firebaseToken)
          .map((user) => user.firebaseToken);
      }
    } else {
      var recipient = await UserService.getById(messageData.recipientId);
      if (recipient && recipient.firebaseToken) {
        tokens.push(recipient.firebaseToken);
      } else {
        log.warn('Either user doesn\'t exist, or has no firebase token.' +
          ' Skipping.');
      }
    }

    if (tokens.length === 0) return;

    var payload = {
      notification: {
        title: sender.firstName,
        body: messageData.message || 'Multimedia',
      },
      tokens: tokens,
    };
    var response = await firebaseAdmin.messaging().sendMulticast(payload);
    log.info('Firebase: Successfully sent message:', response.responses);
  } catch (error) {
    log.error('Firebase: Error sending message:', error);
  }
};

FirebaseService._detectMessageType = (messageData) => {
  var messageType = 'message';
  if (messageData.image) {
    messageType = 'image';
  } else if (messageData.file) {
    messageType = 'file';
  } else if (messageData.snippet) {
    messageType = 'snippet';
  }

  return messageType;
};

FirebaseService.sendMessage = async(workspaceId, sender, messageData) => {
  var refRoute;
  if (messageData.groupId) {
    refRoute = 'messages/groups/group' + messageData.groupId;
  } else {
    var smaller = Math.min(sender.id, messageData.recipientId);
    var larger = Math.max(sender.id, messageData.recipientId);
    refRoute = `messages/users/${workspaceId}-${smaller}-${larger}`;
  }

  var ref = firebaseAdmin.database().ref(refRoute);
  ref.push({
    from: {
      id: sender.id,
      firstName: sender.firstName,
      lastName: sender.lastName,
    },
    messageType: FirebaseService._detectMessageType(messageData),
    image: messageData.image || null,
    file: messageData.file || null,
    snippet: messageData.snippet || null,
    message: messageData.message || null,
    timestamp: moment().format("YYYY-MM-DD'T'HH:mm:ssZZ"),
  });
};

FirebaseService.send = async(workspaceId, sender, messageData) => {
  if (messageData.message) {
    messageData.message = await MessageService.replaceForbiddenWords(
      workspaceId,
      messageData.message
    );
  }
  await FirebaseService.sendMessageNofication(sender, messageData);
  await FirebaseService.sendMessage(workspaceId, sender, messageData);
  await MessageService
    .saveMessageRecord(workspaceId, sender.id, messageData.groupId);
};

module.exports = FirebaseService;
