'use strict';

var EmailService = {};
EmailService.name = 'EmailService';

var { nodemailer } = require('../config/dependencies');
var { gmailEmail, gmailPwd } = require('../config/dependencies');

EmailService.sendEmail = async(userEmail, message, from, subject) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: gmailEmail,
      pass: gmailPwd,
    },
  });
  await transporter.sendMail({
    from: from,
    to: userEmail,
    subject: subject,
    text: message,
    html: message,
  });
};

module.exports = EmailService;
