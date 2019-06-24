'use strict';

var EmailService = {};
EmailService.name = 'EmailService';

var { nodemailer } = require('../config/dependencies');
var { gmailEmail, gmailPwd } = require('../config/dependencies');

EmailService.sendEmail = async(userEmail, message) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: gmailEmail,
      pass: gmailPwd,
    },
  });
  await transporter.sendMail({
    from: '"Hypechat Recovery Password 👻" <hypechat2019@gmail.com>',
    to: userEmail,
    subject: 'Reestablece tu contrasena ✔',
    text: message,
    html: message,
  });
};

module.exports = EmailService;
