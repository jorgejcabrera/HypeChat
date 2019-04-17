'use strict';

var { MessageService, UserService } = require('../services');
var { MessageMapper } = require('../mappers');

var MessageController = {};
MessageController.name = 'MessageController';

MessageController.send = async(req, res, next) => {
  try {
    var sender = req.user;
    var recipient = await UserService.getById(req.params.recipientId);
    if (!recipient || !sender)
      return res.status(404).send();
    if (recipient.id === sender.id)
      return res.status(400).send();
    var message = await MessageService.send(recipient.id, req.body, sender.id);
    res.json(message);
  } catch (err) {
    next(err);
  }
};

// TODO
MessageController.retrieve = async(req, res, next) => {
  try {
    var messages = await MessageService.retrieveUserMessages(req);
    res.json(MessageMapper.map(messages));
  } catch (err) {
    next(err);
  }
};
module.exports = MessageController;
