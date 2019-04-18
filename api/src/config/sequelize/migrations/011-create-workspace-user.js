'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('WorkspaceUsers', {
      userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'User',
            key: 'id'
          }
        },
        workspaceId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Workspace',
            key: 'id'
          }
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('WorkspaceUsers');
  },
};
