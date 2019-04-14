'use strict';

var { MessageController } = require('../controllers');

// may be this routes could be moved to user-routes
module.exports = (app) => {
  app.route('/users/:userId/messages')
    .post(MessageController.send);

  app.route('/users/:userId/messages')
    .get(MessageController.retrieve);
};
