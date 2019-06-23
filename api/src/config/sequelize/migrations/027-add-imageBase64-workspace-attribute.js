'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Workspace', 'base64Image', {
      type: Sequelize.STRING,
    },);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Workspace',
      'base64Image'
    );
  },
};
