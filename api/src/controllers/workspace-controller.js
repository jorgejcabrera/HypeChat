'use strict';

var { WorkspaceService, UserService } = require('../services');

var WorkspaceController = {};
WorkspaceController.name = 'WorkspaceController';

WorkspaceController.create = async(req, res, next) => {
  try {
    req.body.creatorId = req.user.id;
    var workspace = await WorkspaceService.create(req.body);
    res.json(workspace);
  } catch (err) {
    next(err);
  }
};

WorkspaceController.addUser = async(req, res, next) => {
  try {
    var workspace = await WorkspaceService
      .getById(req.params.workspaceId);
    var user = await UserService.getById(req.params.userId);
    if (!user || !workspace)
      return res.status(404).send();
    var userWorkspace = await WorkspaceService.addUser(workspace.id, user.id);
    res.status(201).send(userWorkspace);
  } catch (err) {
    next(err);
  }
};

WorkspaceController.retrieve = async(req, res, next) => {
  try {
    var workspace = await WorkspaceService
      .getById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).send();
    }

    res.json(workspace);
  } catch (err) {
    next(err);
  }
};

WorkspaceController.update = async(req, res, next) => {
  try {
    var workspace = await WorkspaceService
      .update(req.params.workspaceId, req.body);

    if (!workspace) {
      return res.status(404).send();
    }

    res.json(workspace);
  } catch (err) {
    next(err);
  }
};

WorkspaceController.delete = async(req, res, next) => {
  try {
    await WorkspaceService.delete(req.params.workspaceId);
    res.send();
  } catch (err) {
    next(err);
  }
};

module.exports = WorkspaceController;
