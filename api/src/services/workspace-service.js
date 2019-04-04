'use strict';

var { Workspace } = require('../models');

var WorkspaceService = {};
WorkspaceService.name = 'WorkspaceService';

WorkspaceService.create = async(workspaceData) => {
  delete workspaceData.id;
  var workspace = await Workspace.create(workspaceData);
  return workspace && workspace.toJSON();
};

WorkspaceService.getById = async(workspaceId) => {
  var workspace = await Workspace.findByPk(workspaceId);
  return workspace && workspace.toJSON();
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
