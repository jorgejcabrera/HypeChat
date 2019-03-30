'use strict';

var { UserController, MiddlewareController } = require('../controllers');

module.exports = (app) => {
  app.route('/users')
    .post(UserController.create);

  app.route('/users/:userId')
    .get(MiddlewareController.isUserAuthenticated, UserController.retrieve)
    .put(MiddlewareController.isUserAuthenticated, UserController.update)
    .delete(MiddlewareController.isUserAuthenticated, UserController.delete);
};
