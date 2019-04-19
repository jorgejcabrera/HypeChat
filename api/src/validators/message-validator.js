'use strict';

var MessageValidator = {};
MessageValidator.name = 'MessageValidator';

// TODO we must check if both users are workspace members.
MessageValidator.areValidMembers = function(sender, recipient) {
  return !(!recipient || !sender) && !(recipient.id === sender.id);
};

module.exports = MessageValidator;
