'use strict';

var { Workspace, Group, UserGroup } = require('../models');

var GroupService = {};
GroupService.name = 'GroupService';

GroupService.create = async(groupData) => {
  delete groupData.id;
  var group = await Group.create(groupData);

  var members = [group.creatorId];
  if (group && group.visibility === 'PUBLIC') {
    var workspace = await Workspace.findOne({
      where: { id: group.workspaceId },
      include: [
        { association: 'users' },
      ],
    });

    members = workspace.users.map((user) => user.id);
  }

  if (group) {
    members.forEach(async(userId) => {
      await GroupService.addUser(
        group.id,
        userId
      );
    });
  }

  return group && group.toJSON();
};

GroupService.addUser = async(groupId, userId) => {
  var groupUser = await UserGroup.create({
    userId: userId,
    groupId: groupId,
    isActive: true,
  });
  return groupUser && groupUser.toJSON();
};

GroupService.list = async(user, workspaceId) => {
  var query = {
    where: {
      workspaceId: workspaceId,
    },
  };

  if (['MEMBER'].includes(user.workspaceRole)) {
    query.include = [
      {
        association: 'users',
        where: {
          id: user.id,
        },
        attributes: [],
      },
    ];
  }

  var list = await Group.findAll(query);
  return list.map((group) => group.toJSON());
};

GroupService.getPublicGroups = async(workspaceId) => {
  var list = await Group.findAll({
    where: {
      workspaceId: workspaceId,
      visibility: 'PUBLIC',
    },
  });
  return list.map((group) => group.toJSON());
};

GroupService.saveMessageRecord = async(groupId) => {
  var group = await GroupService.getById(groupId);
  group.totalMessages++;
  await Group.update(group, {
    returning: true,
    where: { id: groupId },
  });
};

GroupService.getById = async(groupId) => {
  var group = await Group.findOne({
    where: { id: groupId },
    include: [
      { association: 'users' },
    ],
  });

  return group && group.toJSON();
};

module.exports = GroupService;
