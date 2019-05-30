'use strict';

var { BotService } = require('../services');

var BotController = {};
BotController.name = 'BotController';

BotController.create = async(req, res, next) => {
  try {
    req.body.ownerId = req.user.id;
    if (req.params.workspaceId) {
      req.body.workspaceId = parseInt(req.params.workspaceId, 10);  
    }
    var bot = await BotService.create(req.body);
    res.json(bot);
  } catch (err) {
    next(err);
  }
};

module.exports = BotController;
