'use strict';

var { request, moment } = require('../config/dependencies');
var { User } = require('../models');
var FirebaseService = require('./firebase-service');
var WorkspaceService = require('./workspace-service');

var MentionService = {};
MentionService.name = 'MentionService';

MentionService._lookForUsers = async(match, sender, messageData) => {
  // TODO: handle firstnames with spaces. Maybe user a username instead?
  var taggedUser = await User.findOne({
    where: {
      firstName: match[1],
    },
  });

  if (!taggedUser) return;
  // TODO handle when user doesn't belong to group (add it).

  var belongsToWorkspace = WorkspaceService.userBelongs(
    taggedUser.id, messageData.workspaceId
  );

  if (!belongsToWorkspace) return;

  if (!taggedUser.isBot) {
    FirebaseService.sendNofication(sender, {
      groupId: null,
      recipientId: taggedUser.id,
      message: messageData.message,
    });
  } else if (taggedUser.callbackOnMention) {
    request({
      method: 'POST',
      uri: taggedUser.callbackOnMention,
      body: {
        groupId: messageData.groupId,
        from: {
          id: sender.id,
          firstName: sender.firstName,
          lastName: sender.lastName,
        },
        message: match[2].trim(),
        timestamp: moment().format(),
      },
      json: true,
    });
  }
};

MentionService.analyzeMessage = async(sender, messageData) => {
  // If message is not sent to a group, ignore it.
  if (!messageData.groupId) return;

  var regex = /^@([^ ]+)([\s\S]*)$/;
  var match = messageData.message.match(regex);
  if (!match) return;

  await MentionService._lookForUsers(match, sender, messageData);
};

module.exports = MentionService;
