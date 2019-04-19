'use strict';

var { MessageService, UserService, WorkspaceService } = require('../services');
var { MessageValidator } = require('../validators');

var { MessageMapper } = require('../mappers');

var MessageController = {};
MessageController.name = 'MessageController';

MessageController.send = async(req, res, next) => {
  try {
    var workspace = await WorkspaceService.getById(req.params.workspaceId);
    if (!workspace)
      return res.status(404).send();
    var areValidMembers = await MessageValidator
      .areValidMembers(req.user, req.params.recipientId, workspace.id);
    if (!areValidMembers)
      return res.status(400).send();
    
      var message = await MessageService
      .send(req.params.recipientId, req.body, req.user.id, workspace.id);

    res.json(message);
  } catch (err) {
    // TODO LOGS with warn level
    next(err);
  }
};

MessageController.retrieveMessages = async(req, res, next) => {
  try {
    var workspace = await WorkspaceService.getById(req.params.workspaceId);
    if (!workspace)
      return res.status(404).send();
    var areValidMembers = await MessageValidator
      .areValidMembers(req.user, req.params.senderId, workspace.id);
    if (!areValidMembers)
      return res.status(400).send();

    var messages = await MessageService
      .retrieveMessages(req.user.id, req.params.senderId, workspace.id);
    res.json(MessageMapper.map(messages));
  } catch (err) {
    // TODO LOGS
    next(err);
  }
};

MessageController.retrieveSendedMessages = async(req, res, next) => {
  try {
    var workspace = await WorkspaceService.getById(req.params.workspaceId);
    if (!workspace)
      return res.status(404).send();
    var areValidMembers = await MessageValidator
      .areValidMembers(req.user, req.params.recipientId, workspace.id);
    if (!areValidMembers)
      return res.status(400).send();

    var messages = await MessageService
      .retrieveMessages(req.params.recipientId, req.user.id, workspace.id);
    res.json(MessageMapper.map(messages));
  } catch (err) {
    // TODO LOGS
    next(err);
  }
};

MessageController.retrieveChat = async(req, res, next) => {
  try {
    var workspace = await WorkspaceService.getById(req.params.workspaceId);
    if (!workspace)
      return res.status(404).send();
    var areValidMembers = await MessageValidator
      .areValidMembers(req.user, req.params.recipientId, workspace.id);
    if (!areValidMembers)
      return res.status(400).send();

    var sendedMessages = await MessageService
      .retrieveMessages(req.params.recipientId, req.user.id, workspace.id);
    var messages = await MessageService
      .retrieveMessages(req.user.id, req.params.recipientId, workspace.id);
    var conversation = [...sendedMessages, ...messages];
    res.json(MessageMapper.map(conversation));
  } catch (err) {
    // TODO LOGS
    next(err);
  }
};

module.exports = MessageController;
