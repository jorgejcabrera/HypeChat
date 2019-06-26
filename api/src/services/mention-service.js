'use strict';

var { moment } = require('../config/dependencies');
var { User } = require('../models');
var FirebaseService = require('./firebase-service');
var WorkspaceService = require('./workspace-service');
var HttpService = require('./http-service');

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
  var belongsToWorkspace = await WorkspaceService.userBelongs(
    taggedUser.id, messageData.workspaceId
  );

  if (!belongsToWorkspace) return;

  if (!taggedUser.isBot) {
    await FirebaseService.sendNofication(sender, {
      groupId: null,
      recipientId: taggedUser.id,
      message: messageData.message,
    });
  } else if (taggedUser.callbackOnMention) {
    await HttpService.post(
      taggedUser.callbackOnMention,
      {
        workspaceId: messageData.workspaceId,
        groupId: messageData.groupId,
        from: {
          id: sender.id,
          firstName: sender.firstName,
          lastName: sender.lastName,
        },
        message: match.input,
        timestamp: moment().format(),
      }
    );
  }
};

MentionService.analyzeMessage = async(sender, messageData) => {
  // If message is not sent to a group, ignore it.
  if (!messageData.groupId) return;

  var regex = /@([^\s]+)/;
  var match = messageData.message.match(regex);
  if (!match) return;

  await MentionService._lookForUsers(match, sender, messageData);
};

module.exports = MentionService;
