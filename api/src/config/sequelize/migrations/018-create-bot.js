'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Bot', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      botName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      secretKey: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      callbackOnMention: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Workspace', key: 'id' },
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' },
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
    return queryInterface.dropTable('Bot');
  },
};
