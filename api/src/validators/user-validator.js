'use strict';

var UserValidator = {};
UserValidator.name = 'UserValidator';

UserValidator.isActive = function(user) {
  return user.status === 'ACTIVE';
};

module.exports = UserValidator;
