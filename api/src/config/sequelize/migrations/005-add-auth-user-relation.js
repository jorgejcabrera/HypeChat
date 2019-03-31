'use strict';

/* TODO
  1- create access token index
  2- create fk
  3- maybe we can use (userId,accessToken) like pk
  */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Auth', ['userId'], {
      type: 'foreign key',
      name: 'user_auth_relation',
      references: { // Required field
        table: 'User',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Auth', 'user_auth_relation');
  },
};
