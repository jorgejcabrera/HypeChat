'use strict';

var { MessageService } = require('../services');
var { MessageMapper } = require('../mappers');

var MessageController = {};
MessageController.name = 'MessageController';

// TODO
MessageController.send = async(req, res, next) => {
  var response = await MessageService
    .send(req.params.userId, req.body)
    .catch((err) => next(err));
  res.json(response);
};

// TODO
MessageController.retrieve = async(req, res, next) => {
  var messages = await MessageService
    .retrieveUserMessages(req)
    .catch((err) => next(err));
  res.json(MessageMapper.map(messages));
};
module.exports = MessageController;
