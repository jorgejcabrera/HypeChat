'use strict';

var { Group } = require('../models');

var GroupService = {};
GroupService.name = 'GroupService';

GroupService.create = async(groupData) => {
  delete groupData.id;
  var group = await Group.create(groupData);
  return group && group.toJSON();
};

module.exports = GroupService;
