'use strict';

var { firebaseAdmin, moment } = require('../config/dependencies');
var GroupService = require('./group-service');
var UserService = require('./user-service');

var FirebaseService = {};
FirebaseService.name = 'FirebaseService';

FirebaseService.sendNofication = async(sender, messageData) => {
  try {
    var tokens = [];
    if (messageData.groupId) {
      var group = await GroupService.getById(messageData.groupId);
      if (group) {
        tokens = group.users
          .filter((user) => user.firebaseToken)
          .map((user) => user.firebaseToken);
      }
    } else {
      var recipient = await UserService.getById(messageData.recipientId);
      if (recipient && recipient.firebaseToken) {
        tokens.push(recipient.firebaseToken);
      }
    }

    if (tokens.length === 0) return;

    var payload = {
      notification: {
        title: sender.firstName,
        body: messageData.messageBody,
      },
      tokens: tokens,
    };
    var response = await firebaseAdmin.messaging().sendMulticast(payload);
    console.log('Firebase: Successfully sent message:', response.responses);
  } catch (error) {
    console.log('Firebase: Error sending message:', error);
  }
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
    message: messageData.message,
    timestamp: moment().format(),
  });
};

FirebaseService.send = async(workspaceId, sender, messageData) => {
  await FirebaseService.sendNofication(sender, messageData);
  await FirebaseService.sendMessage(workspaceId, sender, messageData);
};

module.exports = FirebaseService;
