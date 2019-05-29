'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Group', 'workspaceId', {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Workspace',
        key: 'id',
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Group',
      'workspaceId'
    );
  },
};
