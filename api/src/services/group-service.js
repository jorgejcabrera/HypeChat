'use strict';

var { Workspace, Group, UserGroup } = require('../models');

var GroupService = {};
GroupService.name = 'GroupService';

GroupService.create = async(groupData) => {
  delete groupData.id;
  var group = await Group.create(groupData);

  if (group) {
    await GroupService.addUser(
      group.id,
      group.creatorId
    );
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
      visibility: 'PRIVATE',
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
  var privateList = await Group.findAll(query);
  var publicList = await Group.findAll({
    where: {
      workspaceId: workspaceId,
      visibility: 'PUBLIC',
    },
  });

  var list = privateList.concat(publicList);
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

  if (group && group.visibility === 'PUBLIC') {
    var workspace = await Workspace.findOne({
      where: { id: group.workspaceId },
      include: [
        { association: 'users' },
      ],
    });

    group.users = workspace.users;
  }

  return group && group.toJSON();
};

module.exports = GroupService;
