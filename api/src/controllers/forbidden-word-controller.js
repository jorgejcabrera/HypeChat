'use strict';

var { ForbiddenWordService } = require('../services');

var ForbiddenWordController = {};
ForbiddenWordController.name = 'ForbiddenWordController';

ForbiddenWordController.create = async(req, res, next) => {
  try {
    var forbiddenWord = await ForbiddenWordService
      .create(req.params.workspaceId, req.body);
    res.json(forbiddenWord);
  } catch (err){
    next(err);
  }
};

ForbiddenWordController.listAllByWorkspace = async(req, res, next) => {
  try {
    var forbiddenWords = await ForbiddenWordService
      .listAllByWorkspace(req.params.workspaceId);
    res.json(forbiddenWords);
  } catch (err) {
    next(err);
  }
};

ForbiddenWordController.deleteAll = async(req, res, next) => {
  try {
    await ForbiddenWordService.deleteAll(req.params.workspaceId);
    res.send(204);
  } catch (err) {
    next(err);
  }
};

ForbiddenWordController.delete = async(req, res, next) => {
  try {
    await ForbiddenWordService
      .delete(req.params.workspaceId, req.params.wordId);
    res.send(204);
  } catch (err) {
    next(err);
  }
};

module.exports = ForbiddenWordController;
