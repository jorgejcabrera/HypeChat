'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('User', 'isGlobalBot', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'User',
      'isGlobalBot'
    );
  },
};
