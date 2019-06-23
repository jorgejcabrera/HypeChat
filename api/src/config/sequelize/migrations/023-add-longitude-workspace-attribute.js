'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Workspace', 'longitude', {
      type: Sequelize.DOUBLE,
    },);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Workspace',
      'longitude'
    );
  },
};
