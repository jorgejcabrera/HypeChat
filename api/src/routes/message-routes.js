'use strict';

var { MessageController } = require('../controllers');

module.exports = (app) => {
  app.route('/user_recipient/:userId/messages')
    .post(MessageController.send);

  app.route('/user_recipient/:userId/messages')
    .get(MessageController.retrieve);
};
