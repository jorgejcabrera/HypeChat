'use strict';

var { Workspace, WorkspaceUsers, User } = require('../models');
var GroupService = require('./group-service');

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

    await GroupService.create({
      workspaceId: workspace.id,
      creatorId: workspace.creatorId,
      name: 'general',
      description: 'Bienvenido a #general!',
      visibility: 'PUBLIC',
      isActive: true,
    });

    var bots = await User.findAll({
      where: {
        isGlobalBot: true,
        status: 'ACTIVE',
      },
    });

    bots.forEach(async(bot) => {
      await WorkspaceService.addUser(workspace.id, bot.id);
    });
  }

  return workspace && workspace.toJSON();
};

WorkspaceService.list = async(pageNumber = 1) => {
  const PAGE_SIZE = 10;

  var offset = (pageNumber - 1) * PAGE_SIZE;
  var workspacesCount = await Workspace.count();
  if (workspacesCount < offset) {
    var e = new Error();
    e.name = 'OutOfBounds';
    throw e;
  }

  var workspaces = await Workspace.findAll({
    offset: offset,
    limit: PAGE_SIZE,
    order: [['id', 'ASC']],
  });

  workspaces = workspaces.map((workspace) => workspace.toJSON());

  return {
    pageContents: workspaces,
    pageNumber: parseInt(pageNumber, 10),
    total: workspacesCount,
  };
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

WorkspaceService.userBelongs = async(userId, workspaceId) => {
  var workspaceUser = await WorkspaceUsers.findOne({
    where: {
      userId: userId,
      workspaceId: workspaceId,
    },
  });
  return workspaceUser !== null;
};

WorkspaceService.addUser = async(workspaceId, userId, role = 'MEMBER') => {
  var worspaceUser = await WorkspaceUsers.create({
    userId: userId,
    workspaceId: workspaceId,
    role: role,
  });

  var publicGroups = await GroupService.getPublicGroups(workspaceId);

  publicGroups.forEach(async(group) => {
    await GroupService.addUser(group.id, userId);
  });

  return worspaceUser && worspaceUser.toJSON();
};

WorkspaceService.updateUserRole = async(workspaceId, userId, role) => {
  var updated = await WorkspaceUsers.update({
    role: role,
  }, {
    returning: true,
    where: {
      userId: userId,
      workspaceId: workspaceId,
    },
  });
  return updated[1][0] && updated[1][0].toJSON();
};

WorkspaceService.removeUser = async(workspaceId, userId) => {
  return await WorkspaceUsers.destroy({
    where: {
      userId: userId,
      workspaceId: workspaceId,
    },
  });
};

WorkspaceService.update = async(workspaceId, workspaceData) => {
  delete workspaceData.id;
  delete workspaceData.creatorId;
  await Workspace.update(workspaceData, {
    returning: true,
    where: { id: workspaceId },
  });

  return await Workspace.findOne({ where: { id: workspaceId } });
};

WorkspaceService.delete = async(workspaceId) => {
  return await Workspace.destroy({
    where: { id: workspaceId },
  });
};

module.exports = WorkspaceService;
