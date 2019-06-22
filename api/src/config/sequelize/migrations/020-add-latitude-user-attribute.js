'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('User', 'latitude', {
      type: Sequelize.DOUBLE,
    },);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'User',
      'latitude'
    );
  },
};
