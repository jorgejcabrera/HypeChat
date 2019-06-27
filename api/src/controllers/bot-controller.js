'use strict';

var { log } = require('../config/dependencies');
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
      log.warn('Requested workspace not found.');
      return res.status(404).json();
    }
    var bot = await UserService.create(req.body);
    log.info('Bot successfully created.');
    await WorkspaceService.addUser(workspaceId, bot.id);
    log.info('Bot successfully added to workspace.');
    res.json(bot);
  } catch (err) {
    next(err);
  }
};

module.exports = BotController;
