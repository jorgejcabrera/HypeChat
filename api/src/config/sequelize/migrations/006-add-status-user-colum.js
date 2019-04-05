'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('User', 'status', {
      type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
    },);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'User',
      'status'
    );
  },
};
