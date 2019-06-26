'use strict';

var { moment } = require('../config/dependencies');
var { User } = require('../models');
var FirebaseService = require('./firebase-service');
var GroupService = require('./group-service');
var HttpService = require('./http-service');

var MentionService = {};
MentionService.name = 'MentionService';

MentionService._lookForUsers = async(users, sender, messageData) => {
  // TODO: handle firstnames with spaces. Maybe user a username instead?

  var where = { firstName: users };
  if (users.includes('all')) {
    where = {};
  }
  var taggedUsers = await User.findAll({
    where: where,
    include: [
      {
        association: 'workspaces',
        where: {
          id: messageData.workspaceId,
        },
        include: [
          {
            association: 'groups',
            where: {
              id: messageData.groupId,
            },
            required: false,
          },
        ],
      },
    ],
  });

  if (taggedUsers.length === 0) return;

  for (var idx in taggedUsers) {
    var taggedUser = taggedUsers[idx];

    // Add user to group if he doesn't belong.
    if (taggedUser.workspaces[0].groups.length === 0) {
      await GroupService.addUser(messageData.groupId, taggedUser.id);
    }

    if (!taggedUser.isBot) {
      // We specifically don't await here so the message goes out
      // as fast as possible.
      FirebaseService.sendNofication(sender, {
        groupId: null,
        recipientId: taggedUser.id,
        message: messageData.message,
      });
    } else if (taggedUser.callbackOnMention) {
      // We specifically don't await here since we're not waiting for
      // an answer from the bots.
      HttpService.post(
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
