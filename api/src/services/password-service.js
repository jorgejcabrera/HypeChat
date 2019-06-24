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
  var from = '"Hypechat Recovery Password 👻" <hypechat2019@gmail.com>';
  var subject = 'Reestablece tu contrasena ✔';
  await EmailService.sendEmail(email, message, from, subject);
};

module.exports = PasswordService;
