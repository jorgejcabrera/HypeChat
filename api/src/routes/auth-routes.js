'use strict';

var { AuthController, UserController } = require('../controllers');
var { AuthService } = require('../services');
var { passport } = require('../config/dependencies');

module.exports = (app) => {

  app.route('/register')
    .post(
      UserController.create({facebookUser: false})
    );

  app.route('/login')
    .post(
      AuthController.login
    );

  app.route('/facebook/register')
    .post(
      passport.authenticate('facebook-token', {session: false}),
      UserController.create({facebookUser: true})
    );

  app.route('/facebook/login')
    .post(
      passport.authenticate('facebook-token', {session: false}),
      async(req, res, next) => {
        await AuthService.destroyByUser(req.user.id);
        var auth = await AuthService.create(req.user.id);
        res.json(auth);
      }
    );

  app.route('/logout')
    .post(AuthController.logout);
};
