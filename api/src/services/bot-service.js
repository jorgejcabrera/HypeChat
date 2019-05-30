'use strict';

var { Bot } = require('../models');
var { randtoken } = require('../config/dependencies');

var BotService = {};
BotService.name = 'BotService';

BotService.create = async(botData) => {
  delete botData.id;
  botData.secretKey = randtoken.generate(128);
  var bot = await Bot.create(botData);

  return bot && bot.toJSON();
};

module.exports = BotService;
