'use strict';

var { MessageService } = require('../services');

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

};
module.exports = MessageController;
