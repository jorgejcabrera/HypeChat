'use strict';

var UserMapper = {};
UserMapper.name = 'UserMapper';

UserMapper.map = function(user, auth) {
  var jsonUser = user.toJSON ? user.toJSON() : user;
  delete jsonUser.password;
  delete jsonUser.isAdmin;
  if (auth) {
    jsonUser.accessToken = auth.accessToken;
  }
  return jsonUser;
};

module.exports = UserMapper;
