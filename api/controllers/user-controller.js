'use strict';

exports.create = function(req, res) {
    res.send('User created');
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