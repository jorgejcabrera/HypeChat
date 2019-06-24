'use strict';

var PasswordService = {};
PasswordService.name = 'PasswordService';

var { EmailUtils } = require('../utils');
var EmailService = require('./email-service');
var UserService = require('./user-service');

PasswordService.recoveryPassword = async(userEmail) => {
  var email = EmailUtils.normalize(userEmail);
  var newPassword = await UserService.recoveryPassword(email);
  var message = `Tu nueva contrasena es ${newPassword}`;
  await EmailService.sendEmail(email, message);
};

module.exports = PasswordService;
