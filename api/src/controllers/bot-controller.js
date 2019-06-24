'use strict';

var { UserService } = require('../services');

var BotController = {};
BotController.name = 'BotController';

BotController.create = async(req, res, next) => {
  try {
    req.body.isBot = true;
    req.body.isGlobalBot = false;
    var bot = await UserService.create(req.body);
    res.json(bot);
  } catch (err) {
    next(err);
  }
};

module.exports = BotController;
