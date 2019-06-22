'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Workspace', 'latitude', {
      type: Sequelize.DOUBLE,
    },);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Workspace',
      'latitude'
    );
  },
};
