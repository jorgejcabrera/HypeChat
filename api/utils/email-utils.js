'use strict';

var { normalizeemail } = require('../config/dependencies');

var EmailUtils = {};
EmailUtils.name = 'EmailUtils';

EmailUtils.normalize = function(email) {
  return normalizeemail(email);
};

module.exports = EmailUtils;
