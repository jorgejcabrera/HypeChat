'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('User', ['email'], {
      type: 'unique',
      name: 'user_email_unique_constraint',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeConstraint('User', 'user_email_unique_constraint');
  },
};
