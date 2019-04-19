'use strict';

var MessageValidator = {};
MessageValidator.name = 'MessageValidator';

var { WorkspaceUsers } = require('../models');

// TODO we must check if both users are workspace members.
MessageValidator.areValidMembers = async(sender, recipient, workspaceId) => {
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
