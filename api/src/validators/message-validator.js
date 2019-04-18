'use strict';

var MessageValidator = {};
MessageValidator.name = 'MessageValidator';

MessageValidator.areValidMembers = function(sender, recipient) {
  return !(!recipient || !sender) && !(recipient.id === sender.id);
};

module.exports = MessageValidator;
