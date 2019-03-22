'use strict';

//TODO ver porque no anda, hay que ver como importa los packages node
exports.create = function(req, res) {
    User.create(req.body)
        .then(user => res.json(user))
};

exports.retrieve = function(req, res) {
    res.send('User found');
};

exports.update = function(req, res) {
    res.send('User updated');
};

exports.delete = function(req, res) {
    res.send('User deleted');
};


