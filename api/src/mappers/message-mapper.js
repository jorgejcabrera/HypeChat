'use strict';

var MessageMapper = {};
MessageMapper.name = 'MessageMapper';

MessageMapper.map = function(messages) {
  messages.forEach(function(v){
    delete v.id;
    delete v.messageId;
    delete v.createdAt;
    delete v.updatedAt;
    delete v.recipientGroupId;
    delete v['message.parentMessageId'];
    delete v['message.messageId'];
  });
  return messages.sort(function(x, y){
    return x['message.createdAt'] - y['message.createdAt'];
  });
};

module.exports = MessageMapper;
