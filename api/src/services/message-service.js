'use strict';

var MessageService = {};
MessageService.name = 'MessageService';

var { ForbiddenWord, Message } = require('../models');
var GroupService = require('./group-service');

MessageService.replaceForbiddenWords = async(workspaceId, message) => {
  try {
    var forbiddenWords = await ForbiddenWord.findAll({
      where: { workspaceId },
    });
    forbiddenWords.forEach(function(w) {
      var regEx = new RegExp(w.word, 'ig');
      message = message.replace(regEx, w.replaceBy);
    });
    return message;
  } catch (err) {
    console
      .error('It was an error while trying to replace forbidden words:', err);
  }
};

MessageService.saveMessageRecord = async(workspaceId, sender, groupId) => {
  try {
    var messageRecord = await Message.findOne({
      where: { workspaceId: workspaceId, userId: sender},
    });
    var record = {};
    if (!messageRecord) {
      record.workspaceId = workspaceId;
      record.userId = sender;
      record.total = 1;
      await Message.create(record);
    } else {
      record = messageRecord.toJSON();
      record.total++;
      await Message.update(record, {
        returning: true,
        where: { id: record.id },
      });
    }

    if (groupId) {
      await GroupService.saveMessageRecord(groupId);
    }
  } catch (err) {
    console
      .error('It was an error while trying to save message recod:', err);
  }
};

MessageService.getByUserId = async(userId) => {
  var messages = Message.findAll({
    where: {userId},
    raw: true,
  });
  return messages;
};

module.exports = MessageService;
