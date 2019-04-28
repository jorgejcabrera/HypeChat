'use strict';

var { Group, UserGroup } = require('../models');

var GroupService = {};
GroupService.name = 'GroupService';

GroupService.create = async(groupData) => {
  delete groupData.id;
  var group = await Group.create(groupData);

  if (group) {
    await GroupService.addUser(
      group.id,
      group.creatorId,
      'CREATOR'
    );
  }

  return group && group.toJSON();
};

GroupService.addUser = async(groupId, userId, role) => {
  var groupUser = await UserGroup.create({
    userId: userId,
    groupId: groupId,
    role: role,
    isActive: true,
  });
  return groupUser && groupUser.toJSON();
};

GroupService.list = async(user, workspaceId) => {
  var query = {
    where: { workspaceId: workspaceId },
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

module.exports = GroupService;
