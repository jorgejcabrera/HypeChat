'use strict';

var { Workspace, WorkspaceUsers, User } = require('../models');

var WorkspaceService = {};
WorkspaceService.name = 'WorkspaceService';

WorkspaceService.create = async(workspaceData) => {
  delete workspaceData.id;
  var workspace = await Workspace.create(workspaceData);
  if (workspace) {
    await WorkspaceService.addUser(
      workspace.id,
      workspace.creatorId,
      'CREATOR'
    );
  }

  return workspace && workspace.toJSON();
};

WorkspaceService.getById = async(workspaceId) => {
  var workspace = await Workspace.findByPk(workspaceId);
  return workspace && workspace.toJSON();
};

WorkspaceService.retrieveUsers = async(workspaceId) => {
  var users = await WorkspaceUsers.findAll({
    where: { workspaceId: workspaceId },
    include: [{
      model: User,
      as: 'user',
    }],
    raw: true,
  });
  return users;
};

WorkspaceService.retrieveWorkspacesByUser = async(userId) => {
  var workspaces = await WorkspaceUsers.findAll({
    where: { userId: userId },
    include: [{
      model: Workspace,
      as: 'workspace',
    }],
    raw: true,
  });
  return workspaces;
};

WorkspaceService.addUser = async(workspaceId, userId, role = 'MEMBER') => {
  var worspaceUser = await WorkspaceUsers.create({
    userId: userId,
    workspaceId: workspaceId,
    role: role,
  });
  return worspaceUser && worspaceUser.toJSON();
};

WorkspaceService.update = async(workspaceId, workspaceData) => {
  delete workspaceData.id;
  delete workspaceData.creatorId;
  var updated = await Workspace.update(workspaceData, {
    returning: true,
    where: { id: workspaceId },
  });

  return updated[1][0] && updated[1][0].toJSON();
};

WorkspaceService.delete = async(workspaceId) => {
  return await Workspace.destroy({
    where: { id: workspaceId },
  });
};

module.exports = WorkspaceService;
