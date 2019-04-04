'use strict';

var PwdValidator = {};
PwdValidator.name = 'PwdValidator';

PwdValidator.isValid = function(userData) {
  return !(userData.password === null ||
    userData.password.length < 7 ||
    userData.password.match(/[1-9]+/g) === null ||
    userData.password.match(/[A-Z]+/g) === null ||
    userData.password.match(/[a-z]+/g) === null ||
    userData.password.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/) === null);
};

module.exports = PwdValidator;
