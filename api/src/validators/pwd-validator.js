'use strict';

var PwdValidator = {};
PwdValidator.name = 'PwdValidator';

PwdValidator.isValid = function(password) {
  return !(password === null ||
    password.length < 7 ||
    password.match(/[1-9]+/g) === null ||
    password.match(/[A-Z]+/g) === null ||
    password.match(/[a-z]+/g) === null ||
    password.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/) === null);
};

module.exports = PwdValidator;
