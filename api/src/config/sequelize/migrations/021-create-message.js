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
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'User',
            key: 'id',
          },
          unique: 'message_unique_constraint',
        },
        workspaceId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'Workspace',
            key: 'id',
          },
          unique: 'message_unique_constraint',
        },
        total: {
          allowNull: true,
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
      await queryInterface.addIndex('Message', ['userId']),
      await queryInterface.addIndex('Message', ['workspaceId']),
    ];
  },
  down: async(queryInterface, Sequelize) => {
    return queryInterface.dropTable('Message');
  },
};
