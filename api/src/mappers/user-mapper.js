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

module.exports = UserMapper;
