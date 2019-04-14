'use strict';

var { Message,MessageRecipient } = require('../models');

var MessageService = {};
MessageService.name = 'MessageService';

MessageService.send = async(user,messageData) => {
    var message = await Message.create(messageData);
    //TODO bad approach
    var messageRecipient = {};
    messageRecipient.recipientId = user;
    messageRecipient.messageId = message.id;
    messageRecipient.isRead = false;
    var message = await MessageRecipient.create(messageRecipient);
    return message && message.toJSON();
}

module.exports = MessageService;
