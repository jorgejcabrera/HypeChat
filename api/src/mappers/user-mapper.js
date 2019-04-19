'use strict';

var { _, moment } = require('../config/dependencies');


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

UserMapper.stats = function(users) {
  var response = {};
  response['total'] = users.length;
  var grouped = _.groupBy(users, function(item){
    return moment(item.createdAt).format('YYYY-MM-DD');
  });
  response['summary_by_date'] = grouped;
  return response;
};


module.exports = UserMapper;
