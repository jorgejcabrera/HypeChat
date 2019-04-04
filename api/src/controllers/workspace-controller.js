'use strict';

var { WorkspaceService } = require('../services');

var WorkspaceController = {};
WorkspaceController.name = 'WorkspaceController';

WorkspaceController.create = async(req, res, next) => {
  // TODO: remove this after permissions are added.
  req.body.creatorId = req.user ? req.user.id : req.body.creatorId;
  var workspace = await WorkspaceService
    .create(req.body)
    .catch((err) => next(err));
  if (workspace) {
    res.json(workspace);
  }
};

WorkspaceController.retrieve = async(req, res, next) => {
  var workspace = await WorkspaceService
    .getById(req.params.workspaceId)
    .catch((err) => next(err));
  if (workspace) {
    res.json(workspace);
  } else {
    res.status(404).send();
  }
};

WorkspaceController.update = async(req, res, next) => {
  var workspace = await WorkspaceService
    .update(req.params.workspaceId, req.body)
    .catch((err) => next(err));
  if (workspace) {
    res.json(workspace);
  }
};

WorkspaceController.delete = async(req, res, next) => {
  await WorkspaceService
    .delete(req.params.workspaceId)
    .catch((err) => next(err));
  res.send();
};

module.exports = WorkspaceController;
