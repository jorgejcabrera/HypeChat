'use strict';

var { Sequelize } = require('../config/dependencies');
var { Workspace, Group, UserGroup } = require('../models');
var FirebaseService = require('./firebase-service');

var GroupService = {};
GroupService.name = 'GroupService';

GroupService.create = async(groupData) => {
  delete groupData.id;
  var group = await Group.create(groupData);

  var where = {};
  if (group && group.visibility === 'PRIVATE') {
    where = {
      [Sequelize.Op.or]: [
        { isGlobalBot: true },
        { id: group.creatorId },
      ],
    };
  }

  if (group) {
    var workspace = await Workspace.findOne({
      where: { id: group.workspaceId },
      include: [
        {
          association: 'users',
          where: where,
        },
      ],
    });

    var members = workspace.users.map((user) => user.id);

    for (var idx in members) {
      var userId = members[idx];
      await GroupService.addUser(
        group.id,
        userId
      );
    }
  }

  return group && group.toJSON();
};

GroupService.addUser = async(groupId, userId) => {
  var groupUser = await UserGroup.create({
    userId: userId,
    groupId: groupId,
    isActive: true,
  });

  FirebaseService.sendAddedToGroupNofication(userId, {
    title: 'Te han agregado a un nuevo grupo!',
    body: '',
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
