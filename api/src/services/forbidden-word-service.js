'use strict';

var ForbiddenWordService = {};
ForbiddenWordService.name = 'ForbiddenWordService';

var { ForbiddenWord } = require('../models');


ForbiddenWordService.listAllByWorkspace = async(workspaceId) => {
  var forbiddenWords = await ForbiddenWord.findAll({
    where: { workspaceId },
  });

  return forbiddenWords;
};

ForbiddenWordService.create = async(workspaceId, forbiddenWordData) => {
  forbiddenWordData.word = forbiddenWordData.word.trim().toLowerCase();
  forbiddenWordData.workspaceId = workspaceId;

  var forbiddenWord = await ForbiddenWord.findOne({
    where: {
      workspaceId: workspaceId,
      word: forbiddenWordData.word,
    },
  });
  if (forbiddenWord) {
    var e = new Error();
    e.name = 'ForbiddenWordAlreadyExists';
    throw e;
  }
  var forbiddenwWord = await
  ForbiddenWord.create(forbiddenWordData);

  return forbiddenwWord;
};

ForbiddenWordService.deleteAll = async(workspaceId) => {
  await ForbiddenWord.destroy({
    where: { workspaceId },
  });
};

ForbiddenWordService.delete = async(workspaceId, wordId) => {
  var forbiddenWord = await ForbiddenWord.findOne({
    where: {id: wordId},
  });
  if (!forbiddenWord) {
    var ex = new Error();
    ex.name = 'ResourceNotFound';
    throw ex;
  }
  if (forbiddenWord.workspaceId != workspaceId) {
    var e = new Error();
    e.name = 'ForbiddenWordDoesNotBelongToWorkspace';
    throw e;
  }

  await ForbiddenWord.destroy({
    where: {id: wordId},
  });
};

module.exports = ForbiddenWordService;
