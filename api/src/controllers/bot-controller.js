'use strict';

var { UserService, WorkspaceService } = require('../services');

var BotController = {};
BotController.name = 'BotController';

BotController.create = async(req, res, next) => {
  try {
    req.body.isBot = true;
    req.body.isGlobalBot = false;
    var workspaceId = req.body.workspaceId;
    delete req.body.workspaceId;
    var workspace = await WorkspaceService.getById(workspaceId);
    if (!workspace) {
      return res.status(404).json();
    }
    var bot = await UserService.create(req.body);
    await WorkspaceService.addUser(workspaceId, bot.id);
    res.json(bot);
  } catch (err) {
    next(err);
  }
};

module.exports = BotController;
