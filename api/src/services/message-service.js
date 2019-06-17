'use strict';

var MessageService = {};
MessageService.name = 'MessageService';

var { ForbiddenWord } = require('../models');

MessageService.cleanMessage = async(workspaceId, message) => {
  try {
    var forbiddenWords = await ForbiddenWord.findAll({
      where: { workspaceId },
    });
    var words = forbiddenWords.map(function(w){
      var words = {};
      words[w.word] = w.replaceBy;
      return words;
    });

    words.forEach(function(word) {
      for (var w in word) {
        message = message.replace(w, word[w]);
      }
    });
    return message;
  } catch (err) {
    console.error('It was an error while trying to clean message:', err);
  }
};

module.exports = MessageService;
