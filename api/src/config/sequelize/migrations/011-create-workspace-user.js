'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return [
      await queryInterface.createTable('WorkspaceUsers', {
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'User',
            key: 'id',
          },
        },
        workspaceId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Workspace',
            key: 'id',
          },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }),
      await queryInterface.addIndex('WorkspaceUsers', ['userId']),
      await queryInterface.addIndex('WorkspaceUsers', ['workspaceId']),
      await queryInterface.addConstraint('WorkspaceUsers',
        ['userId', 'workspaceId'], {
          type: 'unique',
          name: 'workspace_user_unique_constraint',
        }
      ),
    ];
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('WorkspaceUsers');
  },
};
