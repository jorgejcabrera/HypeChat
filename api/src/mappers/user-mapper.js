'use strict';

var UserMapper = {};
UserMapper.name = 'UserMapper';

UserMapper.map = function(user, auth) {
  var response = {};
  response.id = user.id;
  response.firstName = user.firstName;
  response.lastName = user.lastName;
  response.email = user.email;
  response.accessToken = auth.accessToken;
  return response;
};

module.exports = UserMapper;
