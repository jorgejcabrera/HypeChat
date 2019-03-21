var users = require('../controllers/user-controller');

module.exports = function(app) {
    app.route('/users')
        .post(users.create);
        
    app.route('/users/:userId')
        .get(users.retrieve)
        .put(users.update)
        .delete(users.delete);
};