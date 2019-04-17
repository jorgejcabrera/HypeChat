'use strict';

var { MessageService } = require('../services');
var { MessageMapper } = require('../mappers');

var MessageController = {};
MessageController.name = 'MessageController';

// TODO
MessageController.send = async(req, res, next) => {
  try {
    var message = await MessageService.send(req.params.userId, req.body);
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
