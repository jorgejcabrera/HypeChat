'use strict';

var UserMapper = {};
UserMapper.name = 'UserMapper';

UserMapper.map = function(user, auth) {
  delete user.password;
  delete user.isAdmin;
  if (auth) {
    user.accessToken = auth.accessToken;
  }
  return user;
};

UserMapper.mapProfile = function(user, workspaces, messages) {
  var profile = {};
  profile['image'] = user.image;
  profile['firstName'] = user.firstName;
  profile['lastName'] = user.lastName;
  profile['regristationDate'] = user.createdAt;
  profile['workspaces'] = workspaces.map(function(workspace) {
    return {
      id: workspace['workspaceId'],
      name: workspace['workspace.name'],
    };
  });
  profile['totalMessages'] = messages.map(function(message){
    return {
      workspaceId: message['workspaceId'],
      total: message['total'],
    };
  });
  return profile;
};
module.exports = UserMapper;
