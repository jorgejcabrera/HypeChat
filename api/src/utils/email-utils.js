'use strict';

var { normalizeemail } = require('../config/dependencies');

var EmailUtils = {};
EmailUtils.name = 'EmailUtils';

EmailUtils.normalize = function(email) {
  return normalizeemail(email);
};

EmailUtils.createPrefix = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  'abcdefghijklmnopqrstuvwxyz' +
  '0123456789';
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

module.exports = EmailUtils;
