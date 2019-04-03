'use strict';

var { Workspace } = require('../models');

var WorkspaceService = {};
WorkspaceService.name = 'WorkspaceService';

WorkspaceService.create = async(workspaceData) => {
};

WorkspaceService.getById = async(workspaceId) => {
  var workspace = await Workspace.findByPk(workspaceId);
  return workspace;
};

module.exports = WorkspaceService;
