'use strict';

var { GroupService } = require('../services');

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
    var groupUser = await GroupService.addUser(
      req.params.groupId,
      req.body.userId
    );
    res.send(groupUser);
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
