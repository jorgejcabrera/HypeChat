'use strict';

var MessageValidator = {};
MessageValidator.name = 'MessageValidator';

var { WorkspaceUsers, User } = require('../models');

MessageValidator.areValidMembers = async(sender, recipientId, workspaceId) => {
  var recipient = await User.findOne({
    where: { id: recipientId, status: 'ACTIVE' },
  });
  if (!recipient || !sender)
    return false;

  var isValidSender = await WorkspaceUsers.findOne({
    where: {
      userId: sender.id,
      workspaceId: workspaceId,
    },
  });
  var isValidRecipient = await WorkspaceUsers.findOne({
    where: {
      userId: recipient.id,
      workspaceId: workspaceId,
    },
  });
  if (!isValidSender || !isValidRecipient)
    return false;
  return !(recipient.id === sender.id);
};

module.exports = MessageValidator;
