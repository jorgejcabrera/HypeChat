'use strict';

var { Sequelize, request, moment } = require('../config/dependencies');
var { User, Bot } = require('../models');
var FirebaseService = require('./firebase-service');

var MentionService = {};
MentionService.name = 'MentionService';

MentionService._lookForUsers = async(match, user, messageData) => {
  // TODO: handle firstnames with spaces. Maybe user a username instead?
  var taggedUser = await User.findOne({
    where: {
      firstName: match[1]
    }
  });

  if (taggedUser) {
    // TODO handle when user doesnt belong to group (add it) 
    // or workspace (ignore I guess?).
    FirebaseService.sendNofication(user, {
      groupId: null,
      recipientId: taggedUser.id,
      message: messageData.message,
    });

    return true;
  }
  return false;
}

MentionService._lookForBots = async(match, sender, messageData) => {
  var taggedBot = await Bot.findOne({
    where: {
      botName: match[1],
      callbackOnMention: {
        [Sequelize.Op.ne]: null
      }
    }
  });

  if (taggedBot) {
    // TODO handle when bot doesnt belong to workspace (ignore I guess?).
    request({
      method: 'POST',
      uri: taggedBot.callbackOnMention,
      body: {
        groupId: messageData.groupId,
        from: {
          id: sender.id,
          firstName: sender.firstName,
          lastName: sender.lastName,
        },
        message: match[2],
        timestamp: moment().format(),
      },
      json: true,
    })
  }
}

MentionService.analyzeMessage = async(sender, messageData) => {
  // If message is not sent to a group, ignore it.
  if (!messageData.groupId) return;

  var regex = /^@([^ ]+)([\s\S]*)$/;
  var match = messageData.message.match(regex);
  if (!match) return;

  var found = await MentionService._lookForUsers(match, sender, messageData);
  if (!found) await MentionService._lookForBots(match, sender, messageData);
}

module.exports = MentionService;
