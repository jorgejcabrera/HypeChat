'use strict';

var { moment } = require('../config/dependencies');
var { User } = require('../models');
var FirebaseService = require('./firebase-service');
var WorkspaceService = require('./workspace-service');
var HttpService = require('./http-service');

var MentionService = {};
MentionService.name = 'MentionService';

MentionService._lookForUsers = async(users, sender, messageData) => {
  // TODO: handle firstnames with spaces. Maybe user a username instead?
  var taggedUsers = await User.findAll({
    where: {
      firstName: users,
    },
  });

  if (taggedUsers.length === 0) return;

  for (var idx in taggedUsers) {
    var taggedUser = taggedUsers[idx];
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
          message: messageData.message,
          timestamp: moment().format(),
        }
      );
    }
  }

};

MentionService.analyzeMessage = async(sender, messageData) => {
  // If message is not sent to a group, ignore it.
  if (!messageData.groupId) return;

  var regex = /@([^\s]+)/g;
  var mentions = messageData.message.match(regex);
  if (!mentions) return;

  var users = mentions.map((mention) => mention.substr(1));
  await MentionService._lookForUsers(users, sender, messageData);
};

module.exports = MentionService;
