'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return [
      await queryInterface.createTable('Message', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        total: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
        workspaceId: {
          allowNull: false,
          type: Sequelize.INTEGER,
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
      await queryInterface.addConstraint('Message', ['userId', 'workspaceId'], {
        type: 'unique',
        name: 'message_unique_constraint',
      }),
      await queryInterface.addConstraint('Message', ['userId'], {
        type: 'foreign key',
        name: 'user_message_relation',
        references: {
          table: 'User',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
      await queryInterface.addConstraint('Message', ['workspaceId'], {
        type: 'foreign key',
        name: 'workspace_message_relation',
        references: {
          table: 'Workspace',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
      await queryInterface.addIndex('Message', ['userId']),
      await queryInterface.addIndex('Message', ['workspaceId'])
    ];
  },
  down: async(queryInterface, Sequelize) => {
    return queryInterface.dropTable('Message');
  },
};