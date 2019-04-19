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

    var sender = req.user;
    var recipient = await UserService.getById(req.params.recipientId);
    if (!MessageValidator.areValidMembers(sender, recipient))
      return res.status(400).send();
    var message = await MessageService
      .send(recipient.id, req.body, sender.id, workspace.id);

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

    var recipient = req.user;
    var sender = await UserService.getById(req.params.senderId);
    if (!MessageValidator.areValidMembers(sender, recipient))
      return res.status(400).send();
    var messages = await MessageService
      .retrieveMessages(recipient.id, sender.id, workspace.id);
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

    var sender = req.user;
    var recipient = await UserService.getById(req.params.recipientId);
    if (!MessageValidator.areValidMembers(sender, recipient))
      return res.status(400).send();

    var messages = await MessageService
      .retrieveMessages(recipient.id, sender.id, workspace.id);
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

    var sender = req.user;
    var recipient = await UserService.getById(req.params.recipientId);
    if (!MessageValidator.areValidMembers(sender, recipient))
      return res.status(400).send();
    var sendedMessages = await MessageService
      .retrieveMessages(recipient.id, sender.id, workspace.id);
    var messages = await MessageService
      .retrieveMessages(sender.id, recipient.id, workspace.id);
    var conversation = [...sendedMessages, ...messages];
    res.json(MessageMapper.map(conversation));
  } catch (err) {
    // TODO LOGS
    next(err);
  }
};

module.exports = MessageController;
