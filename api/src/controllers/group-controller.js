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

module.exports = GroupController;
