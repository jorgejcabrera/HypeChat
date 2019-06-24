'use strict';

var MessageValidator = {};
MessageValidator.name = 'MessageValidator';

var { Workspace } = require('../models');

MessageValidator.isValid = async(workspaceId, senderId, data) => {
  var toFind = [senderId];
  if (data.recipientId) {
    toFind.push(data.recipientId);
  } else if (!data.groupId) {
    return false;
  }

  // Checks that at most 1 multimedia type is being used.
  var multimediaTypes = (data.image ? 1 : 0) +
                        (data.file ? 1 : 0) +
                        (data.snippet ? 1 : 0) +
                        (data.message ? 1 : 0);
  if (multimediaTypes !== 1) {
    return false;
  }

  var includes = [
    { association: 'users', where: { id: toFind } },
  ];

  if (data.groupId) {
    includes.push(
      { association: 'groups', where: { id: data.groupId } },
    );
  }

  var found = await Workspace.findOne({
    where: { id: workspaceId },
    include: includes,
  });

  if (data.recipientId) {
    return found !== null && found.users.length === toFind.length;
  } else if (data.groupId) {
    return found !== null && found.groups.length === 1;
  } else {
    return false;
  }

};

module.exports = MessageValidator;
