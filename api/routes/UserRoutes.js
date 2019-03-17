'use strict';

module.exports = function(app) {
    var users = require('../controllers/UserController');

    app.route('/users')
        .post(users.create);
        
    app.route('/users/:userId')
        .get(users.retrieve)
        .put(users.update)
        .delete(users.delete);
};