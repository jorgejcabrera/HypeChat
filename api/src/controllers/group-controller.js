'use strict';

var { GroupService, WorkspaceService, UserService } = require('../services');

var GroupController = {};
GroupController.name = 'GroupController';

GroupController.create = async(req, res, next) => {
  try {
    req.body.creatorId = req.user.id;
    req.body.workspaceId = parseInt(req.params.workspaceId, 10);
    var group = await GroupService.create(req.body);
    res.json(group);
  } catch (err) {
    next(err);
  }
};

GroupController.list = async(req, res, next) => {
  try {
    var list = await GroupService.list(req.user, req.params.workspaceId);
    res.send(list);
  } catch (err) {
    next(err);
  }

};

GroupController.addUser = async(req, res, next) => {
  try {
    var group = await GroupService.getById(req.params.groupId);
    var user = await UserService.getByEmail(req.body.userEmail);
    if (!user || !group) {
      return res.status(404).send();
    }

    var workspaceUser = await WorkspaceService.userBelongs(
      user.id,
      group.workspaceId
    );

    if (!workspaceUser) {
      return res.status(404).send();
    }

    var userGroup = await GroupService.addUser(group.id, user.id);
    res.json(userGroup);
  } catch (err) {
    next(err);
  }
};

GroupController.retrieveUsers = async(req, res, next) => {
  try {
    var group = await GroupService.getById(req.params.groupId);
    if (!group) {
      return res.status(404).send();
    }
    res.send(group.users);
  } catch (err) {
    next(err);
  }
};

GroupController.retrieve = async(req, res, next) => {
  try {
    var group = await GroupService.getById(req.params.groupId);
    if (!group) {
      return res.status(404).send();
    }
    res.send(group);
  } catch (err) {
    next(err);
  }
};

GroupController.update = async(req, res, next) => {
  res.send(500).send('Endpoint in construction');
};

GroupController.delete = async(req, res, next) => {
  res.send(500).send('Endpoint in construction');
};

module.exports = GroupController;
