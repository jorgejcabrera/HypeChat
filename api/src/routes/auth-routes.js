'use strict';

var {
  AuthController,
  UserController,
  BotController,
} = require('../controllers');
var { passport } = require('../config/dependencies');

module.exports = (app) => {

  app.route('/bot/register').post(BotController.create);

  app.route('/register').post(UserController.create);

  app.route('/login').post(AuthController.login);

  app.route('/facebook/login')
    .post(
      passport.authenticate('facebook-token', {session: false}),
      AuthController.login
    );

  app.route('/logout').post(AuthController.logout);
};
